<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ExternalToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ExternalAuthController extends Controller
{
    private function respOk($resp): bool
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

    private function respJson($resp): array
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
    public function storeCredentials(Request $request)
    {
        $data = $request->validate([
            'provider' => ['required', 'string', 'in:jubelio'],
            'endpoint' => ['nullable', 'url'],
            'email' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $endpoint = 'https://api2.jubelio.com/login';
        $encrypted = null;
        try {
            $encrypted = Crypt::encryptString($data['password']);
        } catch (\Throwable $e) {
            $encrypted = null;
        }

        try {
            $record = ExternalToken::query()->updateOrCreate(
                ['provider' => $data['provider']],
                [
                    'endpoint' => $endpoint,
                    'email' => $data['email'],
                    'password_encrypted' => $encrypted,
                    'password_mask' => Str::random(24),
                ]
            );
        } catch (\Throwable $e) {
            $this->writeFileRecord([
                'provider' => $data['provider'],
                'endpoint' => $endpoint,
                'email' => $data['email'],
                'password_encrypted' => $encrypted,
                'password_mask' => Str::random(24),
                'token' => null,
                'expires_at' => null,
                'last_fetched_at' => null,
            ]);
            return response()->json(['ok' => true]);
        }

        return response()->json(['ok' => true, 'id' => $record->id]);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'provider' => ['required', 'string'],
            'password' => ['sometimes', 'string'],
        ]);
        $provider = $validated['provider'];

        try {
            $record = ExternalToken::query()->where('provider', $provider)->firstOrFail();
        } catch (\Throwable $e) {
            $fileRecord = $this->readFileRecord($provider);
            if (!$fileRecord) {
                return response()->json(['error' => 'credentials_missing'], 404);
            }
            $password = $validated['password'] ?? ($fileRecord['password_encrypted'] ? Crypt::decryptString($fileRecord['password_encrypted']) : null);
            if (!$password) {
                return response()->json(['error' => 'credentials_missing'], 422);
            }
            $resp = Http::asJson()->post($fileRecord['endpoint'], [
                'email' => $fileRecord['email'],
                'password' => $password,
            ]);
            if (! $this->respOk($resp)) {
                return response()->json(['error' => 'login_failed', 'detail' => $this->respJson($resp)], 400);
            }
            $payload = $this->respJson($resp);
            $token = $payload['token'] ?? ($payload['access_token'] ?? ($payload['data']['token'] ?? null));
            $fileRecord['token'] = $token;
            $fileRecord['last_fetched_at'] = Carbon::now()->toISOString();
            $fileRecord['expires_at'] = Carbon::now()->addHours(12)->toISOString();
            $this->writeFileRecord($fileRecord);
            return response()->json([
                'token' => $token,
                'expires_at' => $fileRecord['expires_at'],
            ]);
        }

        $password = $validated['password'] ?? ($record->password_encrypted ? Crypt::decryptString($record->password_encrypted) : null);
        if (!$password) {
            return response()->json(['error' => 'credentials_missing'], 422);
        }

        $response = Http::asJson()->post($record->endpoint, [
            'email' => $record->email,
            'password' => $password,
        ]);

        if (! $this->respOk($response)) {
            return response()->json(['error' => 'login_failed', 'detail' => $this->respJson($response)], 400);
        }

        $payload = $this->respJson($response);
        $token = $payload['token'] ?? ($payload['access_token'] ?? ($payload['data']['token'] ?? null));

        $record->update([
            'token' => $token,
            'last_fetched_at' => Carbon::now(),
            'expires_at' => Carbon::now()->addHours(12),
        ]);

        return response()->json([
            'token' => $token,
            'expires_at' => $record->expires_at,
        ]);
    }

    public function getToken(Request $request)
    {
        $provider = $request->validate([
            'provider' => ['required', 'string'],
        ])['provider'];

        try {
            $record = ExternalToken::query()->where('provider', $provider)->first();
            if (!$record) {
                return response()->json(['error' => 'credentials_missing'], 404);
            }
        } catch (\Throwable $e) {
            $fileRecord = $this->readFileRecord($provider);
            if (!$fileRecord) {
                return response()->json(['error' => 'credentials_missing'], 404);
            }
            $now = Carbon::now();
            $needsRefresh = empty($fileRecord['token']) || empty($fileRecord['expires_at']) || $now->diffInMinutes(Carbon::parse($fileRecord['expires_at']), false) <= 60;
            if ($needsRefresh) {
                $password = $fileRecord['password_encrypted'] ? Crypt::decryptString($fileRecord['password_encrypted']) : null;
            $resp = Http::asJson()->post($fileRecord['endpoint'], [
                    'email' => $fileRecord['email'],
                    'password' => $password,
                ]);
            if ($this->respOk($resp)) {
                $payload = $this->respJson($resp);
                    $token = $payload['token'] ?? ($payload['access_token'] ?? ($payload['data']['token'] ?? null));
                    $fileRecord['token'] = $token;
                    $fileRecord['last_fetched_at'] = $now->toISOString();
                    $fileRecord['expires_at'] = $now->addHours(12)->toISOString();
                    $this->writeFileRecord($fileRecord);
                }
            }
            return response()->json([
                'token' => $fileRecord['token'],
                'expires_at' => $fileRecord['expires_at'] ?? null,
                'provider' => $provider,
            ]);
        }

        $now = Carbon::now();
        $needsRefresh = !$record->token || !$record->expires_at || $now->diffInMinutes(Carbon::parse($record->expires_at), false) <= 60;
        if ($needsRefresh) {
            // attempt refresh
            $password = $record->password_encrypted ? Crypt::decryptString($record->password_encrypted) : null;
            $response = Http::asJson()->post($record->endpoint, [
                'email' => $record->email,
                'password' => $password,
            ]);
            if ($this->respOk($response)) {
                $payload = $this->respJson($response);
                $token = $payload['token'] ?? ($payload['access_token'] ?? ($payload['data']['token'] ?? null));
                $record->update([
                    'token' => $token,
                    'last_fetched_at' => $now,
                    'expires_at' => $now->addHours(12),
                ]);
            }
        }

        return response()->json([
            'token' => $record->token,
            'expires_at' => $record->expires_at,
            'provider' => $record->provider,
        ]);
    }

    protected function filePath(): string
    {
        $path = Storage::path('private/external_tokens.json');
        if (!file_exists($path)) {
            @mkdir(dirname($path), 0777, true);
            file_put_contents($path, json_encode([]));
        }
        return $path;
    }

    protected function readFileRecord(string $provider): ?array
    {
        $content = @file_get_contents($this->filePath());
        $data = $content ? json_decode($content, true) : [];
        return $data[$provider] ?? null;
    }

    protected function writeFileRecord(array $record): void
    {
        $path = $this->filePath();
        $content = @file_get_contents($path);
        $data = $content ? json_decode($content, true) : [];
        $data[$record['provider']] = $record;
        file_put_contents($path, json_encode($data));
    }
}
