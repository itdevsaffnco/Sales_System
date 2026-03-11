<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ExternalToken;
use App\Models\SalesJubelio;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class JubelioController extends Controller
{
    protected function getFileRecord(string $provider): ?array
    {
        $path = Storage::path('private/external_tokens.json');
        $content = @file_get_contents($path);
        $data = $content ? json_decode($content, true) : [];
        return $data[$provider] ?? null;
    }

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

    protected function getValidToken(): ?string
    {
        $provider = 'jubelio';
        try {
            $record = ExternalToken::query()->where('provider', $provider)->first();
            if ($record) {
                $now = Carbon::now();
                $needs = !$record->token || !$record->expires_at || $now->diffInMinutes(Carbon::parse($record->expires_at), false) <= 60;
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
                            $record->update([
                                'token' => $token,
                                'last_fetched_at' => $now,
                                'expires_at' => $now->addHours(12),
                            ]);
                        }
                }
                }
                return $record->token;
            }
        } catch (\Throwable $e) {}

        $file = $this->getFileRecord($provider);
        if ($file) {
            $now = Carbon::now();
            $needs = empty($file['token']) || empty($file['expires_at']) || $now->diffInMinutes(Carbon::parse($file['expires_at']), false) <= 60;
            if ($needs) {
                $password = $file['password_encrypted'] ? Crypt::decryptString($file['password_encrypted']) : null;
                if ($password) {
                    $resp = Http::asJson()->post($file['endpoint'], [
                        'email' => $file['email'],
                        'password' => $password,
                    ]);
                    if ($this->respOk($resp)) {
                        $payload = $this->respJson($resp);
                        $token = $payload['token'] ?? ($payload['access_token'] ?? ($payload['data']['token'] ?? null));
                        $file['token'] = $token;
                        $file['last_fetched_at'] = $now->toISOString();
                        $file['expires_at'] = $now->addHours(12)->toISOString();
                        $path = Storage::path('private/external_tokens.json');
                        $content = @file_get_contents($path);
                        $data = $content ? json_decode($content, true) : [];
                        $data[$provider] = $file;
                        @file_put_contents($path, json_encode($data));
                    }
                }
            }
            return $file['token'] ?? null;
        }
        return null;
    }

    protected function sanitizeEndpoint(string $endpoint): string
    {
        $endpoint = trim($endpoint);
        $endpoint = rtrim($endpoint, ", \t\n\r\0\x0B");
        return $endpoint;
    }

    public function syncSales(Request $request)
    {
        $incomingToken = $request->input('token');
        $token = is_string($incomingToken) && strlen($incomingToken) > 10 ? $incomingToken : $this->getValidToken();
        if (!$token) {
            return response()->json(['error' => 'token_missing'], 400);
        }
        $override = $request->input('endpoint');
        $base = 'https://api2.jubelio.com';
        $candidates = $override ? [$override] : [
            "$base/sales",
            "$base/sales/invoices",
        ];
        // keep endpoint exactly as provided (some APIs require trailing slash before query)

        $payload = [];
        $ok = false;
        $lastError = null;
        foreach ($candidates as $url) {
            $hasQuery = str_contains($url, '?');
            $created = $request->input('createdSince');
            $params = $hasQuery ? [] : ['createdSince' => $created ?: Carbon::now()->subDays(14)->toDateString()];
            try {
                $resp = Http::withToken($token)->acceptJson()->retry(2, 200)->timeout(30)->get($url, $params);
                $payload = $this->respJson($resp);
                if ($this->respOk($resp) && isset($payload['data']) && is_array($payload['data'])) {
                    $ok = true;
                    break;
                }
            } catch (\Throwable $e) {
                $lastError = $e->getMessage();
            }
        }
        if (! $ok) {
            return response()->json(['error' => 'fetch_failed', 'detail' => $payload ?: ['message' => $lastError ?: 'No candidate endpoint returned data']], 400);
        }
        try {
            $items = $payload['data'] ?? [];
            foreach ($items as $it) {
                SalesJubelio::updateOrCreate(
                    ['doc_id' => $it['doc_id']],
                    [
                        'doc_number' => $it['doc_number'] ?? null,
                        'contact_id' => $it['contact_id'] ?? null,
                        'customer_name' => $it['customer_name'] ?? null,
                        'ref_no' => $it['ref_no'] ?? null,
                        'transaction_date' => isset($it['transaction_date']) ? Carbon::parse($it['transaction_date']) : null,
                        'salesorder_id' => $it['salesorder_id'] ?? null,
                        'due_date' => isset($it['due_date']) ? Carbon::parse($it['due_date']) : null,
                        'is_opening_balance' => (bool) ($it['is_opening_balance'] ?? false),
                        'grand_total' => $it['grand_total'] ?? 0,
                        'doc_type' => $it['doc_type'] ?? null,
                        'age' => $it['age'] ?? null,
                        'age_due' => $it['age_due'] ?? null,
                        'due' => $it['due'] ?? 0,
                        'last_modified' => isset($it['last_modified']) ? Carbon::parse($it['last_modified']) : null,
                        'salesman_name' => $it['salesmen_name'] ?? ($it['salesman_name'] ?? null),
                        'so_customer_name' => $it['so_customer_name'] ?? null,
                        'created_date' => isset($it['created_date']) ? Carbon::parse($it['created_date']) : null,
                        'store_name' => $it['store_name'] ?? null,
                        'store_id' => $it['store_id'] ?? null,
                        'downpayment_amount' => $it['downpayment_amount'] ?? 0,
                    ]
                );
            }
            return response()->json(['ok' => true, 'count' => count($items)], 200);
        } catch (\Throwable $e) {
            return response()->json(['ok' => false, 'error' => 'sync_failed', 'message' => $e->getMessage()], 200);
        }
    }

    public function listSales(Request $request)
    {
        $per = (int) ($request->query('per_page', 50));
        $per = $per > 0 && $per <= 200 ? $per : 50;
        $q = SalesJubelio::query()->orderByDesc('transaction_date')->orderByDesc('id');
        if ($request->has('store_id')) {
            $q->where('store_id', $request->query('store_id'));
        }
        if ($request->has('doc_number')) {
            $q->where('doc_number', 'like', '%' . $request->query('doc_number') . '%');
        }
        $page = (int) ($request->query('page', 1));
        $result = $q->paginate($per, ['*'], 'page', $page);
        if ($result->total() === 0 && $request->boolean('fetch_if_empty')) {
            $endpoint = $this->sanitizeEndpoint($request->query('endpoint', 'https://api2.jubelio.com/sales'));
            $incomingToken = $request->query('token');
            $token = is_string($incomingToken) && strlen($incomingToken) > 10 ? $incomingToken : $this->getValidToken();
            if ($token) {
                $params = [];
                if ($request->has('createdSince')) {
                    $params['createdSince'] = $request->query('createdSince');
                }
                try {
                    $hasQuery = str_contains($endpoint, '?');
                    $req = Http::withToken($token)->acceptJson();
                    $resp = $hasQuery ? $req->get($endpoint) : $req->get($endpoint, $params);
                    $payload = $this->respJson($resp);
                    if ($this->respOk($resp) && isset($payload['data']) && is_array($payload['data'])) {
                        usort($payload['data'], function ($a, $b) {
                            return strcmp(($b['transaction_date'] ?? ''), ($a['transaction_date'] ?? ''));
                        });
                        return response()->json([
                            'data' => $payload['data'],
                            'current_page' => 1,
                            'last_page' => 1,
                            'total' => count($payload['data']),
                        ]);
                    } else {
                        return response()->json([
                            'data' => [],
                            'current_page' => 1,
                            'last_page' => 1,
                            'total' => 0,
                            'error' => $payload['message'] ?? 'not_found',
                        ]);
                    }
                } catch (\Throwable $e) {
                    return response()->json([
                        'data' => [],
                        'current_page' => 1,
                        'last_page' => 1,
                        'total' => 0,
                        'error' => 'fetch_exception',
                    ]);
                }
            }
        }
        return response()->json($result);
    }

    public function fetch(Request $request)
    {
        $endpoint = $request->input('endpoint');
        if (!is_string($endpoint) || !preg_match('/^https?:\\/\\//i', $endpoint)) {
            return response()->json(['ok' => false, 'error' => 'invalid_endpoint'], 200);
        }
        $endpoint = $this->sanitizeEndpoint($endpoint);
        $incomingToken = $request->input('token');
        $token = is_string($incomingToken) && strlen($incomingToken) > 10 ? $incomingToken : $this->getValidToken();
        if (!$token) {
            return response()->json(['ok' => false, 'error' => 'token_missing'], 200);
        }
        $params = $request->except(['endpoint','token']);
        if (!str_contains($endpoint, '?') && empty($params['createdSince'])) {
            $params['createdSince'] = Carbon::now()->subDays(14)->toDateString();
        }
        try {
            $hasQuery = str_contains($endpoint, '?');
            $req = Http::withToken($token)->acceptJson();
            $resp = $hasQuery ? $req->get($endpoint) : $req->get($endpoint, $params);
            $payload = $this->respJson($resp);
            $ok = $this->respOk($resp);
            return response()->json(['ok' => $ok, 'payload' => $payload], 200);
        } catch (\Throwable $e) {
            return response()->json(['ok' => false, 'error' => 'fetch_exception', 'message' => $e->getMessage()], 200);
        }
    }
}
