<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserPayment;

class AdminPaymentController extends Controller
{
    /**
     * Display a paginated list of payments.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $payments = UserPayment::with('user') // Assuming there's a user relationship
            ->where('payment_status', 'Processing')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($payments);
    }

    /**
     * Approve a payment.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function approve($id)
    {
        $payment = UserPayment::find($id);

        if (!$payment) {
            return response()->json(['message' => 'Payment not found'], 404);
        }

        $payment->payment_status = 'Approved';
        $payment->save();

        return response()->json(['message' => 'Payment approved successfully']);
    }

    /**
     * Reject a payment and update its status back to Unpaid.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function reject(Request $request, $id)
    {
        $payment = UserPayment::find($id);

        if (!$payment) {
            return response()->json(['message' => 'Payment not found'], 404);
        }

        $request->validate([
            'reason' => 'required|string|max:255',
        ]);

        $payment->payment_status = 'Unpaid';
        $payment->rejection_reason = $request->reason; // Add this column in migration
        $payment->save();

        return response()->json(['message' => 'Payment rejected successfully']);
    }
}
