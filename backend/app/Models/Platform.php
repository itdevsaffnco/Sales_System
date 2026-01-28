<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Platform extends Model
{
    protected $table = 'platforms';

    public $timestamps = false;

    protected $fillable = [
        'name',
        'type',
        'gmv_formula',
        'gmv_after_support_formula',
    ];

    public static function calculateGmvForEntry(array $entry, ?self $platform = null): array
    {
        $context = [
            'rsp' => (int) ($entry['pricing_rsp_new'] ?? 0),
            'qty' => (int) ($entry['qty'] ?? 0),
            'margin' => (int) ($entry['margin'] ?? 0),
            'brand_disc' => (int) ($entry['brand_disc'] ?? 0),
            'brand_voucher' => (int) ($entry['brand_voucher'] ?? 0),
            'revenue' => (int) ($entry['revenue'] ?? 0),
            'member' => (int) ($entry['member'] ?? 0),
            'gmv' => 0,
        ];

        $gmvFormula = $platform && $platform->gmv_formula ? $platform->gmv_formula : 'rsp * qty';
        $gmv = self::evaluateFormula($gmvFormula, $context);

        $context['gmv'] = $gmv;
        $gmvAfterFormula = $platform && $platform->gmv_after_support_formula
            ? $platform->gmv_after_support_formula
            : 'gmv - (brand_disc + brand_voucher + margin + member)';

        $gmvAfterSupport = self::evaluateFormula($gmvAfterFormula, $context);
        if ($gmvAfterSupport < 0) {
            $gmvAfterSupport = 0;
        }

        return [
            'gmv' => $gmv,
            'gmv_after_support' => $gmvAfterSupport,
            'gmv_formula' => $gmvFormula,
            'gmv_after_support_formula' => $gmvAfterFormula,
        ];
    }

    public static function simulateGmv(array $entry, ?string $gmvFormula, ?string $gmvAfterSupportFormula): array
    {
        $context = [
            'rsp' => (float) ($entry['pricing_rsp_new'] ?? 0),
            'qty' => (float) ($entry['qty'] ?? 0),
            'margin' => (float) ($entry['margin'] ?? 0),
            'brand_disc' => (float) ($entry['brand_disc'] ?? 0),
            'brand_voucher' => (float) ($entry['brand_voucher'] ?? 0),
            'revenue' => (float) ($entry['revenue'] ?? 0),
            'member' => (float) ($entry['member'] ?? 0),
            'gmv' => 0,
        ];

        // Default GMV formula is rsp * qty, unless overridden
        $gmvFormulaToUse = $gmvFormula !== null && $gmvFormula !== '' ? $gmvFormula : 'rsp * qty';
        // But per latest requirement, GMV is ALWAYS rsp * qty, so we can force it or just use default.
        // User said: "GMV sudah pasti RSP * qty". So we prioritize default if empty, but if frontend sends empty, we use default.
        // If frontend doesn't send it, it's null.
        if ($gmvFormula === null || trim($gmvFormula) === '') {
            $gmvFormulaToUse = 'rsp * qty';
        }
        
        $gmv = self::evaluateFormula($gmvFormulaToUse, $context);

        $context['gmv'] = $gmv;
        $gmvAfterFormulaToUse = $gmvAfterSupportFormula !== null && $gmvAfterSupportFormula !== '' ? $gmvAfterSupportFormula : 'gmv - (brand_disc + brand_voucher + margin + member)';
        $gmvAfterSupport = self::evaluateFormula($gmvAfterFormulaToUse, $context);
        if ($gmvAfterSupport < 0) {
            $gmvAfterSupport = 0;
        }

        return [
            'gmv' => $gmv,
            'gmv_after_support' => $gmvAfterSupport,
        ];
    }

    protected static function evaluateFormula(string $formula, array $context): int
    {
        $expression = strtolower($formula);
        $tokens = [];
        $length = strlen($expression);
        $i = 0;

        while ($i < $length) {
            $char = $expression[$i];

            if (ctype_space($char)) {
                $i++;
                continue;
            }

            if (ctype_digit($char) || $char === '.') {
                $number = '';
                while ($i < $length && (ctype_digit($expression[$i]) || $expression[$i] === '.')) {
                    $number .= $expression[$i];
                    $i++;
                }
                $tokens[] = ['type' => 'number', 'value' => (float) $number];
                continue;
            }

            if (ctype_alpha($char) || $char === '_') {
                $name = '';
                while ($i < $length && (ctype_alpha($expression[$i]) || $expression[$i] === '_' || ctype_digit($expression[$i]))) {
                    $name .= $expression[$i];
                    $i++;
                }
                $canonical = str_replace('_', '', strtolower($name));
                $value = 0.0;
                if (array_key_exists($canonical, self::buildContext($context))) {
                    $value = (float) self::buildContext($context)[$canonical];
                }
                $tokens[] = ['type' => 'number', 'value' => $value];
                continue;
            }

            if (in_array($char, ['+', '-', '*', '/', '(', ')'], true)) {
                $tokens[] = ['type' => 'operator', 'value' => $char];
                $i++;
                continue;
            }

            $i++;
        }

        $outputQueue = [];
        $operatorStack = [];
        $precedence = [
            '+' => 1,
            '-' => 1,
            '*' => 2,
            '/' => 2,
        ];

        foreach ($tokens as $token) {
            if ($token['type'] === 'number') {
                $outputQueue[] = $token;
                continue;
            }

            $value = $token['value'];
            if ($value === '(') {
                $operatorStack[] = $value;
                continue;
            }

            if ($value === ')') {
                while (! empty($operatorStack) && end($operatorStack) !== '(') {
                    $op = array_pop($operatorStack);
                    $outputQueue[] = ['type' => 'operator', 'value' => $op];
                }
                if (! empty($operatorStack) && end($operatorStack) === '(') {
                    array_pop($operatorStack);
                }
                continue;
            }

            while (! empty($operatorStack)) {
                $top = end($operatorStack);
                if ($top === '(') {
                    break;
                }
                $topPrecedence = $precedence[$top] ?? 0;
                $currentPrecedence = $precedence[$value] ?? 0;
                if ($topPrecedence < $currentPrecedence) {
                    break;
                }
                $op = array_pop($operatorStack);
                $outputQueue[] = ['type' => 'operator', 'value' => $op];
            }

            $operatorStack[] = $value;
        }

        while (! empty($operatorStack)) {
            $op = array_pop($operatorStack);
            if ($op !== '(' && $op !== ')') {
                $outputQueue[] = ['type' => 'operator', 'value' => $op];
            }
        }

        $stack = [];

        foreach ($outputQueue as $token) {
            if ($token['type'] === 'number') {
                $stack[] = $token['value'];
                continue;
            }

            if (count($stack) < 2) {
                continue;
            }

            $b = array_pop($stack);
            $a = array_pop($stack);
            $result = 0.0;

            if ($token['value'] === '+') {
                $result = $a + $b;
            } elseif ($token['value'] === '-') {
                $result = $a - $b;
            } elseif ($token['value'] === '*') {
                $result = $a * $b;
            } elseif ($token['value'] === '/') {
                $result = $b == 0.0 ? 0.0 : $a / $b;
            }

            $stack[] = $result;
        }

        if (empty($stack)) {
            return 0;
        }

        $final = array_pop($stack);

        if (! is_finite($final)) {
            return 0;
        }

        return (int) round($final);
    }

    protected static function buildContext(array $context): array
    {
        $normalized = [];
        foreach ($context as $key => $value) {
            $canonical = str_replace('_', '', strtolower($key));
            $normalized[$canonical] = (float) $value;
        }

        return $normalized;
    }
}
