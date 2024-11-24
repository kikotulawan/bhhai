<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Rules\DivisibleBy;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\{Payment, User,PaymentSchedule,Setting};

class PaymentController extends Controller
{

    /**
     * List all payments with optional search and pagination.
     *
     * @param  Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = Payment::query();

        // Filter by approved/rejected status
        // Apply status filter if provided
        if ($request->has('status') && $request->status !== 'All') {
            $query->where('status', $request->status);
        }

        // Apply search filters if provided
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('transaction_id', 'like', "%$search%")
                  ->orWhere('gcash_reference_id', 'like', "%$search%")
                  ->orWhereHas('user', function ($u) use ($search) {
                      $u->where('firstName', 'like', "%$search%")
                        ->orWhere('lastName', 'like', "%$search%")
                        ->orWhere('email', 'like', "%$search%");
                  });
            });
        }

        // Paginate the results
        $payments = $query->with('user')->orderBy('created_at', 'DESC')->paginate(10); // Adjust pagination as needed

        // Adjust response format if necessary
        return response()->json($payments);
    }

    /**
     * List all pending payments with optional search and pagination.
     *
     * @param  Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function pendingPayments(Request $request)
    {
        $query = Payment::query();

        // Filter by pending status
        $query->where('status', 'pending');

        // Apply search filters if provided
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('transaction_id', 'like', "%$search%")
                  ->orWhere('gcash_reference_id', 'like', "%$search%")
                  ->orWhereHas('user', function ($u) use ($search) {
                      $u->where('firstName', 'like', "%$search%")
                        ->orWhere('lastName', 'like', "%$search%")
                        ->orWhere('email', 'like', "%$search%");
                  });
            });
        }

        // Paginate the results
        $payments = $query->with('user')->orderBy('created_at', 'DESC')->paginate(10); // Adjust pagination as needed

        // Adjust response format if necessary
        return response()->json($payments);
    }

    /**
     * Approve the specified payment.
     */
    public function approve(Payment $payment)
    {
        $payment->approve();

        return response()->json([
            'message' => 'Payment approved successfully.',
            'status' => $payment->status,
        ]);
    }

    /**
     * Reject the specified payment.
     */
    public function reject(Payment $payment)
    {
        $payment->reject();

        return response()->json([
            'message' => 'Payment rejected successfully.',
            'status' => $payment->status,
        ]);
    }

    public function accountHolders()
    {
        // Fetch users who are account holders and select specific fields
        $users = User::where('is_account_holder', 1)
            ->get(['id', 'firstName', 'lastName']); // Use get() instead of all()
    
        // Return the users as a JSON response
        return response()->json($users);
    }
    
    public function create(Request $request)
    {

        $setting = Setting::latest()->first();
        $monthlyPayment = int($setting->monthly_payment) ?? 0;
        
        // Validate the incoming request
        $validated = $request->validate([
            'gcash_reference_id' => 'required|string|max:255',
            'user_id' => 'required|exists:users,id', // Ensure the user ID exists
            'amount' => ['required', 'numeric', 'min:'.$monthlyPayment, new DivisibleBy($monthlyPayment)],
        ]);
    
        // Fetch the most recent approved payment for the user
        $recentPayment = Payment::where('user_id', $validated['user_id'])
            ->where('status', 'approved') // Assuming you have a status field to check for approved payments
            ->orderBy('created_at', 'desc')
            ->first();
    
        // Calculate the number of months based on the amount
        $monthsToCover = $validated['amount'] / $monthlyPayment;
    
        // Determine the start date
        if ($recentPayment) {
            // Use the next_due date from the most recent approved payment
            $startMonth = Carbon::parse($recentPayment->next_due)->addMonth();
        } else {
            // If no recent payment, start from now
            $startMonth = Carbon::now();
        }
    
        // Calculate the end date and format it as "Month Year"
        $endDate = $startMonth->copy()->addMonths($monthsToCover - 1)->format('F Y');
        $periodCoveredDate = Carbon::parse($endDate);
        $nextDue = $periodCoveredDate->copy()->addMonth()->format('F Y');
    
        // Generate a unique transaction ID
        $transactionId = 'transaction_' . Str::random(10);
    
        // Create a new payment record
        $payment = Payment::create([
            'gcash_reference_id' => $validated['gcash_reference_id'],
            'transaction_id' => $transactionId,
            'user_id' => $validated['user_id'],
            'amount' => $validated['amount'],
            'period_covered' => $endDate, // Save as "Month Year" format
            'next_due' => $nextDue, // Save as "Month Year" format
            'created_at' => now(), // Set the current date and time
            'updated_at' => now(), // Set the current date and time
        ]);
    
        // Return a response
        return response()->json([
            'message' => 'Payment created successfully',
            'payment' => $payment,
        ], 201);
    }
    

    public function showRecentPayment($userId)
    {
        $recentPayment = Payment::getMostRecentPaymentForUser($userId);

        if ($recentPayment) {
            return response()->json($recentPayment);
        } else {
            return response()->json(['message' => 'No payments found for this user.'], 404);
        }
    }

    public function getUnpaidSchedules(Request $request)
{
    // Fetch unpaid schedules for the authenticated user
    $schedules = Schedule::where('status', 'unpaid')
        ->orderBy('due_date', 'asc')
        ->get();

    return response()->json(['schedules' => $schedules], 200);
}


public function storeProofOfPayment(Request $request)
{
    try {
        // Validate incoming request
        $request->validate([
            'userId' => 'required|integer|exists:users,id',
            'amount' => 'required|numeric',
            'gcashRefId' => 'required|string',
            'proofFile' => 'required|file|mimes:jpeg,png,pdf|max:2048',
            'selectedPayments' => 'required|json', // This is an array of payment schedule IDs or objects with 'id' field
        ]);

        // Decode selectedPayments JSON to an array
        $selectedPayments = json_decode($request->selectedPayments, true);

        // Save the proof file if provided
        $filePath = null;
        if ($request->hasFile('proofFile')) {
            $filePath = $request->file('proofFile')->store('proofs', 'public');
        }

        // Process each payment schedule ID
        foreach ($selectedPayments as $schedule) {
            // Ensure that $schedule contains an ID; adjust if it's just an array of IDs
            $scheduleId = is_array($schedule) ? $schedule['id'] : $schedule;

            $payment = new Payment();
            $payment->user_id = $request->userId;
            $payment->transaction_id = uniqid('transaction_');
            $payment->gcash_reference_id = $request->gcashRefId;
            $payment->amount = $request->amount;
            $payment->period_covered = json_encode($schedule); 
            $payment->status = 'pending'; // Set payment status to pending
            $payment->proof_file_path = $filePath;
            $payment->payment_schedule_id = $scheduleId;
            $payment->save();

            // Update the status of the corresponding PaymentSchedule to pending
            $paymentSchedule = PaymentSchedule::find($scheduleId);
            if ($paymentSchedule) {
                $paymentSchedule->status = 'pending'; // Set the schedule to pending initially
                $paymentSchedule->save();
            }
        }

        return response()->json(['message' => 'Payment proof submitted successfully!'], 201);

    } catch (\Exception $e) {
        // Log the detailed error for debugging
        \Log::error("Payment error: " . $e->getMessage(), [
            'trace' => $e->getTraceAsString(),
            'request' => $request->all(),
        ]);
        return response()->json(['error' => 'Internal Server Error: ' . $e->getMessage()], 500);
    }
}

public function approveProofOfPayment($paymentId)
{
    try {
        // Find the Payment
        $payment = Payment::findOrFail($paymentId);

        // Update the Payment status to approved
        $payment->status = 'paid';
        $payment->save();

        // Update the related PaymentSchedule status to approved
        $paymentSchedule = PaymentSchedule::find($payment->payment_schedule_id);
        if ($paymentSchedule && $paymentSchedule->status === 'pending') {
            $paymentSchedule->status = 'paid';
            $paymentSchedule->save();
        }

        return response()->json(['message' => 'Payment approved successfully!'], 200);

    } catch (\Exception $e) {
        \Log::error("Approval error: " . $e->getMessage(), [
            'trace' => $e->getTraceAsString(),
            'paymentId' => $paymentId,
        ]);
        return response()->json(['error' => 'Internal Server Error: ' . $e->getMessage()], 500);
    }
}


}



