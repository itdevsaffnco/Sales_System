<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Models\ExternalToken;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

class Kernel extends ConsoleKernel
{
    protected function respOk($resp): bool
    {
        if (is_object($resp) && method_exists($resp, 'successful')) {
            return $resp->successful();
        }
        if (is_object($resp) && method_exists($resp, 'status')) {
            $code = $resp->status();
            return $code >= 200 && $code < 300;
        }
        return false;
    }

    protected function respJson($resp): array
    {
        if (is_object($resp) && method_exists($resp, 'json')) {
            $data = $resp->json();
            return is_array($data) ? $data : [];
        }
        if (is_object($resp) && method_exists($resp, 'body')) {
            $data = json_decode($resp->body(), true);
            return is_array($data) ? $data : [];
        }
        return [];
    }
    protected function schedule(Schedule $schedule): void
    {
        $schedule->call(function () {
            try {
                $records = ExternalToken::query()->get();
                foreach ($records as $record) {
                    $now = Carbon::now();
                    $needs = !$record->token || !$record->expires_at || $now->diffInMinutes(Carbon::parse($record->expires_at), false) <= 120;
                    if ($needs) {
                        $password = $record->password_encrypted ? Crypt::decryptString($record->password_encrypted) : null;
                        if ($password) {
                            $resp = Http::asJson()->post($record->endpoint, [
                                'email' => $record->email,
                                'password' => $password,
                            ]);
                            if ($this->respOk($resp)) {
                                $payload = $this->respJson($resp);
                                $token = $payload['token'] ?? ($payload['access_token'] ?? ($payload['data']['token'] ?? null));
                                if ($token) {
                                    $record->update([
                                        'token' => $token,
                                        'last_fetched_at' => $now,
                                        'expires_at' => $now->addHours(12),
                                    ]);
                                }
                            }
                        }
                    }
                }
            } catch (\Throwable $e) {
                $path = Storage::path('private/external_tokens.json');
                $content = @file_get_contents($path);
                $data = $content ? json_decode($content, true) : [];
                $changed = false;
                foreach ($data as $provider => $rec) {
                    $now = Carbon::now();
                    $needs = empty($rec['token']) || empty($rec['expires_at']) || $now->diffInMinutes(Carbon::parse($rec['expires_at']), false) <= 120;
                    $password = $rec['password_encrypted'] ? Crypt::decryptString($rec['password_encrypted']) : null;
                    if ($password && $needs) {
                        $resp = Http::asJson()->post($rec['endpoint'], [
                            'email' => $rec['email'],
                            'password' => $password,
                        ]);
                        if ($this->respOk($resp)) {
                            $payload = $this->respJson($resp);
                            $token = $payload['token'] ?? ($payload['access_token'] ?? ($payload['data']['token'] ?? null));
                            if ($token) {
                                $rec['token'] = $token;
                                $rec['last_fetched_at'] = $now->toISOString();
                                $rec['expires_at'] = $now->addHours(12)->toISOString();
                                $data[$provider] = $rec;
                                $changed = true;
                            }
                        }
                    }
                }
                if ($changed) {
                    @file_put_contents($path, json_encode($data));
                }
            }
        })->hourly();
    }

    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');
        require base_path('routes/console.php');
    }
}
