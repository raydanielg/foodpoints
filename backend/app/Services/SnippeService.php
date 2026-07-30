<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SnippeService
{
    private string $apiKey;
    private string $baseUrl;
    private string $apiVersion;
    private string $webhookSecret;

    public function __construct()
    {
        $this->apiKey = config('snippe.api_key', '');
        $this->baseUrl = config('snippe.base_url', 'https://api.snippe.sh');
        $this->apiVersion = config('snippe.api_version', '2026-01-25');
        $this->webhookSecret = config('snippe.webhook_secret', '');
    }

    public function isConfigured(): bool
    {
        return !empty($this->apiKey);
    }

    private function headers(): array
    {
        return [
            'Authorization' => 'Bearer ' . $this->apiKey,
            'Content-Type' => 'application/json',
        ];
    }

    private function idempotencyKey(string $prefix, int $paymentId): string
    {
        $key = $prefix . '-' . $paymentId . '-' . time();
        return substr($key, 0, 30);
    }

    public function createMobilePayment(array $data): array
    {
        $payload = [
            'payment_type' => 'mobile',
            'details' => [
                'amount' => (int) $data['amount'],
                'currency' => 'TZS',
            ],
            'phone_number' => $data['phone_number'],
            'customer' => [
                'firstname' => $data['customer_first_name'] ?? 'Customer',
                'lastname' => $data['customer_last_name'] ?? 'Guest',
                'email' => $data['customer_email'] ?? 'guest@foodpoint.co.tz',
            ],
            'webhook_url' => $data['webhook_url'] ?? route('snippe.webhook'),
            'metadata' => $data['metadata'] ?? [],
        ];

        $key = $this->idempotencyKey('pay', $data['metadata']['payment_id'] ?? 0);

        try {
            $response = Http::withHeaders($this->headers())
                ->withHeader('Idempotency-Key', $key)
                ->post($this->baseUrl . '/v1/payments', $payload);

            return $this->parseResponse($response);
        } catch (\Exception $e) {
            Log::error('Snippe createMobilePayment error: ' . $e->getMessage());
            return ['success' => false, 'message' => 'Payment service unavailable'];
        }
    }

    public function getPaymentStatus(string $reference): array
    {
        try {
            $response = Http::withHeaders($this->headers())
                ->get($this->baseUrl . '/v1/payments/' . $reference);

            return $this->parseResponse($response);
        } catch (\Exception $e) {
            Log::error('Snippe getPaymentStatus error: ' . $e->getMessage());
            return ['success' => false, 'message' => 'Unable to check payment status'];
        }
    }

    public function pushUssd(string $reference): array
    {
        try {
            $response = Http::withHeaders($this->headers())
                ->post($this->baseUrl . '/v1/payments/' . $reference . '/push');

            return $this->parseResponse($response);
        } catch (\Exception $e) {
            Log::error('Snippe pushUssd error: ' . $e->getMessage());
            return ['success' => false, 'message' => 'Unable to send USSD push'];
        }
    }

    public function getBalance(): array
    {
        try {
            $response = Http::withHeaders($this->headers())
                ->get($this->baseUrl . '/v1/payments/balance');

            return $this->parseResponse($response);
        } catch (\Exception $e) {
            Log::error('Snippe getBalance error: ' . $e->getMessage());
            return ['success' => false, 'message' => 'Unable to get balance'];
        }
    }

    public function createCheckoutSession(array $data): array
    {
        $payload = [
            'amount' => (int) $data['amount'],
            'currency' => 'TZS',
            'allowed_methods' => ['mobile_money'],
            'customer' => [
                'name' => $data['customer_name'] ?? 'Customer',
                'phone' => $data['phone'] ?? '',
                'email' => $data['email'] ?? 'guest@foodpoint.co.tz',
            ],
            'redirect_url' => $data['redirect_url'] ?? '',
            'webhook_url' => $data['webhook_url'] ?? route('snippe.webhook'),
            'description' => $data['description'] ?? 'FoodPoint Order',
            'metadata' => $data['metadata'] ?? [],
            'expires_in' => $data['expires_in'] ?? 3600,
        ];

        try {
            $response = Http::withHeaders($this->headers())
                ->post($this->baseUrl . '/api/v1/sessions', $payload);

            return $this->parseResponse($response);
        } catch (\Exception $e) {
            Log::error('Snippe createCheckoutSession error: ' . $e->getMessage());
            return ['success' => false, 'message' => 'Unable to create checkout session'];
        }
    }

    public function verifyWebhookSignature(string $rawBody, string $timestamp, string $signature): bool
    {
        if (empty($this->webhookSecret)) {
            return false;
        }

        $expectedSignature = hash_hmac('sha256', $timestamp . '.' . $rawBody, $this->webhookSecret);
        return hash_equals($expectedSignature, $signature);
    }

    private function parseResponse($response): array
    {
        if ($response->successful()) {
            return [
                'success' => true,
                'data' => $response->json('data'),
                'code' => $response->json('code'),
            ];
        }

        return [
            'success' => false,
            'message' => $response->json('message') ?? 'Request failed',
            'error_code' => $response->json('error_code'),
            'code' => $response->status(),
        ];
    }
}
