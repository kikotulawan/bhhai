<?php

namespace App\Http\Controllers;

use App\Models\{User, UserPayment, ActivatedYear, MonthlyPayment, Setting};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\UserApprovedMail;
use Illuminate\Support\Facades\Validator;

class UserPaymentController extends Controller
{
    public function getActivatedYears() 
    {
        $activated_years = ActivatedYear::where('is_active', 1)->get()->pluck('year');
        return response()->json($activated_years);
    }

    
    public function getPaymentsByYear(User $user, $year)
    {
        if ($user->role == 'Renter') {
            $existingPayments = UserPayment::where('year', $year)
                ->where('block', $user->block)
                ->where('lot', $user->lot)
                ->get();

            $response = collect(range(1, 12))->map(function ($month) use ($existingPayments) {
                $payment = $existingPayments->firstWhere('month', $month);
                return [
                    'month' => $month,
                    'payment_status' => $payment->payment_status ?? 'No Payment',
                    'proof_of_payment' => $payment->proof_of_payment,
                    'transaction_reference' => $payment->transaction_reference,
                ];
            });

            return response()->json($response);
        }

        if($user->is_account_holder == 0) {
            $existingPayments = UserPayment::where('year', $year)
                ->where('block', $user->block)
                ->where('lot', $user->lot)
                ->get();
        } else {
            $existingPayments = $user->userPayments()->where('year', $year)->get();
             // If no payments exist for the selected year, create 12 months with correct payment statuses
            if ($existingPayments->isEmpty()) {
                $months = collect(range(1, 12))->map(function ($month) use ($user, $year) {
                    // Determine if the current month should be Paid or Unpaid
                    $paymentStatus = 'Paid';

                    // Check if the user was created before or during this month in the year
                    if ($user->created_at->year < $year || 
                        ($user->created_at->year == $year && $user->created_at->month <= $month)) {
                        $paymentStatus = 'Unpaid';
                    }

                    return [
                        'user_id' => $user->id,
                        'block' => $user->block,
                        'lot' => $user->lot,
                        'year' => $year,
                        'month' => $month,
                        'payment_status' => $paymentStatus,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                });

                // Insert all months for the selected year
                \DB::table('user_payments')->insert($months->toArray());

                // Retrieve the newly created payments
                $existingPayments = $user->userPayments()->where('year', $year)->get();
            }
        }

       

        // Format months for all 12 months
        $response = collect(range(1, 12))->map(function ($month) use ($existingPayments) {
            $payment = $existingPayments->firstWhere('month', $month);
            return [
                'month' => $month,
                'payment_status' => $payment->payment_status ?? 'No Payment',
                'proof_of_payment' => $payment->proof_of_payment,
                'transaction_reference' => $payment->transaction_reference,
            ];
        });

        return response()->json($response);
    }

    // Get current homeowner's tenants
    public function getMyTenants(Request $request, User $user)
    {
        // Get the search query and current page
        $search = $request->input('search', '');  // Default to empty string if no search term
        $currentPage = $request->input('page', 1); // Default to page 1 if no page is specified
        $perPage = 50;  // Number of tenants per page

        // Build the query based on the user's block, lot, and role as 'Renter'
        $query = User::where('block', $user->block)
                     ->where('lot', $user->lot)
                     ->where('role', 'Renter');

        // Apply search if provided
        if ($search) {
            $query->where(function ($query) use ($search) {
                $query->where('firstName', 'like', '%' . $search . '%')
                      ->orWhere('middleName', 'like', '%' . $search . '%')
                      ->orWhere('lastName', 'like', '%' . $search . '%');
            });
        }

        // Paginate the results
        $tenants = $query->paginate($perPage);

        // Return paginated tenants as a JSON response
        return response()->json($tenants);
    }

    // Add new homeowner's tenant
    public function addNewTenant(Request $request)
    {
        $user = User::create([
            'firstName' => $request->firstName,
            'middleName' => $request->middleName,
            'lastName' => $request->lastName,
            'email' => $request->email,
            'block' => $request->block,
            'lot' => $request->lot,
            'nameOfOwner' => $request->nameOfOwner,
            'contact_number' => $request->contactNumber,
            'username' => $request->username,
            'family_id' => $request->family_id,
            'role' => 'Renter',
        ]);

        $currentHolder = User::where('block', $user->block)
                            ->where('lot', $user->lot)
                            ->where('is_account_holder', 1)
                            ->where('role', 'Renter')
                            ->first();

        if(!$currentHolder) {
            $user->is_account_holder = 1;
            $user->save();
        }
        
        $password = 'mayaccount123';
        Mail::to($user->email)->send(new UserApprovedMail($user, $password));

        return response()->json(['message' => 'Tenant added successfully']);
    }

    public function updateTenant(Request $request, User $user)
    {
        try {
            $user->update([
                'firstName' => $request->firstName,
                'middleName' => $request->middleName,
                'lastName' => $request->lastName,
                'email' => $request->email,
                'contact_number' => $request->contactNumber
            ]);
    
            return response()->json(['message' => 'Tenant updated successfully']);
        } catch (\Exception $e) {
            // If any exception occurs, log and return an error response
            \Log::error('Error updating tenant: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to update tenant. Please try again later.'], 500);
        }
    }
    
    public function updateAccountHolder(User $user)
    {
        $currentHolder = User::where('block', $user->block)
                            ->where('lot', $user->lot)
                            ->where('is_account_holder', 1)
                            ->where('role', 'Renter')
                            ->first();
        
        $currentHolder->is_account_holder = 0;
        $currentHolder->save();
        
        $user->is_account_holder = 1;
        $user->save();

        return response()->json(['message' => 'Tenant account holder updated'], 201);
    }

    public function deleteTenant(Request $request, User $user)
    {
        // Check if the user exists
        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        // Attempt to delete the user
        try {
            $user->delete();  // Delete the user record

            return response()->json(['message' => 'User deleted successfully.']);
        } catch (\Exception $e) {
            // Log the error and return a failure message
            \Log::error('Error deleting user: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to delete user. Please try again later.'], 500);
        }
    }

    public function addPayment(Request $request, User $user) {
        $request->validate([
            'year' => 'required|integer',
            'month' => 'required|integer|min:1|max:12',
            'proof_of_payment' => 'required|image|mimes:jpeg,png,jpg|max:2048', // Validate image
        ]);


        $block = $user->block;
        $lot = $user->lot;

        $user = User::where('role', 'Homeowner')
                ->where('block', $block)
                ->where('lot', $lot)
                ->where('is_account_holder', 1)
                ->first();
    
        $setting = Setting::where('id', 1)->first();
        $monthlyPayment = $setting->monthly_payment ?? 0;
    
        $year = $request->year;
        $month = $request->month;
        $transaction_reference = Str::uuid();
    
        $unpaidMonths = $user->userPayments()
            ->where('year', $year)
            ->whereBetween('month', [1, $month])
            ->where('payment_status', '!=', 'Paid')
            ->pluck('month');
    
        if ($unpaidMonths->isEmpty()) {
            return response()->json(['message' => 'No unpaid months to process.'], 400);
        }
    
        // Store the proof of payment
        $proofPath = $request->file('proof_of_payment')->store('proof_of_payments', 'public');
    
        foreach ($unpaidMonths as $unpaidMonth) {
            UserPayment::updateOrCreate(
                ['user_id' => $user->id, 'year' => $year, 'month' => $unpaidMonth],
                ['payment_status' => 'Processing', 'proof_of_payment' => $proofPath, 'transaction_reference' => $transaction_reference]
            );
        }

         // Determine the period covered (e.g., Jan-March)
        $monthsCovered = $unpaidMonths->sort()->map(function ($month) {
            return \DateTime::createFromFormat('!m', $month)->format('F');
        })->toArray();
        $periodCovered = $monthsCovered[0] . '-' . end($monthsCovered). ' ' . $year;

        $total_amount = count($unpaidMonths) * $monthlyPayment;

        // Save the record to MonthlyPayment
        MonthlyPayment::create([
            'user_id' => $user->id,
            'transaction_reference' => $transaction_reference,
            'period_covered' => $periodCovered,
            'amount' => $total_amount,
            'proof_of_payment' => $proofPath
        ]);
    
        return response()->json([
            'message' => 'Payment submitted successfully. Pending approval.',
            'total_amount' => $total_amount,
            'months_covered' => $unpaidMonths,
        ]);
    }
    
    public function getRejectedPayments(Request $request)
    {
        // Get search term (optional, can be provided in the query params)
        $search = $request->query('search');

        $rejectedPayments = MonthlyPayment::
            when($search, function ($query, $search) {
                // Apply search to 'transaction_reference' or user 'firstName' or 'lastName'
                $query->where('is_approved', 0)
                    ->whereNotNull('reject_reason')
                    ->where('transaction_reference', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('firstName', 'like', "%{$search}%")
                            ->orWhere('lastName', 'like', "%{$search}%");
                    });
            })
            ->where('is_approved', 0)
            ->whereNotNull('reject_reason')
            ->with('user') // Eager load the related 'user' model
            ->paginate(10); // Pagination with 10 items per page

        return response()->json($rejectedPayments);
    }

    public function getPendingPayments(Request $request)
    {
        // Get search term (optional, can be provided in the query params)
        $search = $request->query('search');

        $pendingPayments = MonthlyPayment::
            when($search, function ($query, $search) {
                $query->where('is_approved', 0)
                    ->whereNull('reject_reason')
                    ->where('transaction_reference', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('firstName', 'like', "%{$search}%")
                            ->orWhere('lastName', 'like', "%{$search}%");
                    });
            })
            ->where('is_approved', 0)
            ->whereNull('reject_reason') // Only pending payments, no reject reason
            ->with('user') // Eager load the related 'user' model
            ->paginate(10); // Pagination with 10 items per page

        return response()->json($pendingPayments);
    }

    public function getApprovedPayments(Request $request)
    {
        // Get search term (optional, can be provided in the query params)
        $search = $request->query('search');

        $approvedPayments = MonthlyPayment:: 
            when($search, function ($query, $search) {
                // Apply search to 'transaction_reference' or user 'firstName' or 'lastName'
                $query->where('is_approved', 1) // Only approved payments
                    ->with('user') // Eager load the related 'user' model
                    ->where('transaction_reference', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('firstName', 'like', "%{$search}%")
                            ->orWhere('lastName', 'like', "%{$search}%");
                    });
            })
            ->where('is_approved', 1) // Only approved payments
            ->with('user') // Eager load the related 'user' model
            ->paginate(10); // Pagination with 10 items per page

        return response()->json($approvedPayments);
    }

    public function getDelayedPayments(Request $request)
    {
        $search = $request->input('search', null);

        $delayedPayments = UserPayment::getDelayedPayments($search);

        return response()->json($delayedPayments);
    }


    public function approvePayment(Request $request)
    {
        $monthlyPayment = MonthlyPayment::where('transaction_reference', $request->transaction_reference)->first();
        $monthlyPayment->is_approved = 1;
        $monthlyPayment->save();

        $payments = UserPayment::where('transaction_reference', $request->transaction_reference)->get();
        if (!$payments->isEmpty()) {
            foreach ($payments as $payment) {
                $payment->payment_status = 'Paid';
                $payment->save();
            }
        }
        return response()->json(['message' => 'Payment approved successfully.']);
    }

    public function rejectPayment(Request $request)
    {
        $monthlyPayment = MonthlyPayment::where('transaction_reference', $request->transaction_reference)->first();
        $monthlyPayment->reject_reason = $request->reject_reason;
        $monthlyPayment->save();

        $payments = UserPayment::where('transaction_reference', $request->transaction_reference)->get();
        if (!$payments->isEmpty()) {
            foreach ($payments as $payment) {
                $payment->payment_status = 'Unpaid';
                $payment->save();
            }
        }
        return response()->json(['message' => 'Payment rejected successfully.']);
    }

    public function updateSpamNotifications(Request $request)
    {
        $validated = $request->validate([
            'enable_spam_notifications' => 'required|boolean',
        ]);

        // Assuming there is only one setting record, or you're targeting a specific setting
        $setting = Setting::first(); // If there are multiple, you'd target one specifically

        // Update the field
        $setting->enable_spam_notifications = $validated['enable_spam_notifications'];
        $setting->save();

        return response()->json([
            'message' => 'Spam notification setting updated successfully.',
            'enable_spam_notifications' => $setting->enable_spam_notifications
        ]);
    }

    public function getSpamNotifications()
    {
        $setting = Setting::first(); 
    
        return response()->json([
            'enable_spam_notifications' => $setting->enable_spam_notifications,
        ]);
    }

    public function getMonthlyPaymentAmount()
    {
        $setting = Setting::first(); 
    
        return response()->json(['monthly_payment' => $setting->monthly_payment, 'account_number' => $setting->account_number]);
    }

    public function updateSettings(Request $request)
    {
        $setting = Setting::first(); 
        $setting->monthly_payment = $request->monthly_payment;
        $setting->account_number = $request->account_number;
        $setting->save();
        return response()->json(['message' => 'Settings updated']);
    }
}
