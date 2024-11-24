<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class UserPayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'block',
        'lot',
        'year',
        'month',
        'payment_status',
        'proof_of_payment',
        'rejection_reason',
        'transaction_reference'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get delayed payments with search and pagination.
     *
     * @param int $year
     * @param string|null $search
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public static function getDelayedPayments($search = null)
    {
        $currentYear = Carbon::now()->year;
        $currentMonth = Carbon::now()->month;

        return self::where(function ($query) use ($currentYear, $currentMonth) {
                $query->where('year', '<', $currentYear) // Previous years
                    ->orWhere(function ($subQuery) use ($currentYear, $currentMonth) {
                        $subQuery->where('year', $currentYear)
                                ->where('month', '<', $currentMonth); // Earlier months in the current year
                    });
            })
            ->where('payment_status', 'Unpaid')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('transaction_reference', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($userQuery) use ($search) {
                            $userQuery->where(DB::raw("CONCAT(firstName, ' ', lastName)"), 'like', "%{$search}%");
                        });
                });
            })
            ->with('user')
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->paginate(10);
    }
    
    public static function getDelayedAllPayments()
    {
        $currentYear = Carbon::now()->year;
        $currentMonth = Carbon::now()->month;
    
        $payments = self::where(function ($query) use ($currentYear, $currentMonth) {
                $query->where('year', '<', $currentYear) // Previous years
                    ->orWhere(function ($subQuery) use ($currentYear, $currentMonth) {
                        $subQuery->where('year', $currentYear)
                                ->where('month', '<', $currentMonth);
                    });
            })
            ->where('payment_status', 'Unpaid')
            ->with('user')
            ->get();
    
        // Group payments by user and year
        $groupedPayments = $payments->groupBy(function ($payment) {
            return $payment->user->id . '-' . $payment->year; // Combine user ID and year as a unique key
        });
    
        // Transform the grouped data for better readability (optional)
        $result = $groupedPayments->map(function ($group) {
            return [
                'user' => $group->first()->user, // User details
                'year' => $group->first()->year, // Year
                'payments' => $group,           // All payments for this group
            ];
        });
    
        return $result;
    }
    
}
