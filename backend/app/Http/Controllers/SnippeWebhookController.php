<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\OrderItem;
use App\Models\Restaurant;
use App\Models\TableSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SnippeWebhookController extends Controller
{
    private const COMMISSION_RATE = 0.015; // 1.5%

    public function handleWebhook(Request $request)
    {
        $rawBody = $request->getContent();
        $timestamp = $request->header('X-Webhook-Timestamp');
        $signature = $request->header('X-Webhook-Signature');
        $eventType = $request->header('X-Webhook-Event');

        $snippe = app(\App\Services\SnippeService::class);

        if ($timestamp && $signature) {
            if (!$snippe->verifyWebhookSignature($rawBody, $timestamp, $signature)) {
                Log::warning('Snippe webhook: invalid signature');
                return response('Invalid signature', 400);
            }

            if (abs(time() - (int) $timestamp) > 300) {
                Log::warning('Snippe webhook: timestamp too old');
                return response('Timestamp too old', 400);
            }
        }

        $data = $request->input('data', []);
        $reference = $data['reference'] ?? null;
        $status = $data['status'] ?? null;
        $metadata = $data['metadata'] ?? [];

        $paymentId = $metadata['payment_id'] ?? null;
        if (!$paymentId) {
            $payment = Payment::where('snippe_reference', $reference)->first();
            if ($payment) {
                $paymentId = $payment->id;
            }
        }

        if (!$paymentId) {
            Log::warning('Snippe webhook: no payment found for reference ' . $reference);
            return response('OK', 200);
        }

        $payment = Payment::find($paymentId);
        if (!$payment) {
            return response('OK', 200);
        }

        if ($eventType === 'payment.completed' && $payment->status !== 'completed') {
            $this->handlePaymentCompleted($payment);
        } elseif ($eventType === 'payment.failed' && $payment->status === 'pending') {
            $payment->update(['status' => 'failed']);
            Log::info('Snippe webhook: payment ' . $payment->id . ' failed');
        }

        return response('OK', 200);
    }

    private function handlePaymentCompleted(Payment $payment): void
    {
        DB::beginTransaction();
        try {
            $payment->update(['status' => 'completed']);

            $session = $payment->session;
            $session->increment('paid_amount', $payment->amount);

            if ($payment->split_type === 'by_item' && $payment->item_ids) {
                OrderItem::whereIn('id', $payment->item_ids)
                    ->update([
                        'paid' => true,
                        'paid_by_label' => $payment->payer_label,
                    ]);
            }

            // Commission: 1.5% of payment amount goes to platform
            $commission = round($payment->amount * self::COMMISSION_RATE, 2);
            $netEarning = $payment->amount - $commission;

            $restaurant = Restaurant::find($payment->restaurant_id);
            if ($restaurant) {
                $restaurant->increment('available_balance', $netEarning);
                $restaurant->increment('total_earned', $netEarning);
                $restaurant->increment('total_commission', $commission);
            }

            if ($session->fresh()->paid_amount >= $session->total_amount - 0.01) {
                $session->update([
                    'status' => 'closed',
                    'closed_at' => now(),
                ]);
                $session->table->update(['status' => 'free']);
            }

            DB::commit();
            Log::info('Snippe webhook: payment ' . $payment->id . ' completed');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Snippe webhook: error completing payment ' . $payment->id . ': ' . $e->getMessage());
        }
    }
}
