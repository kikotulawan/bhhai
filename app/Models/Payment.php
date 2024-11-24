<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Payment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'transaction_id',
        'gcash_reference_id',
        'amount',
        'period_covered',     // Period covered (e.g., "January 2025")
        'status',
        'proof_file_path',    // Path ng uploaded proof file
        'payment_schedule_id', // Foreign key for the schedule
    ];

    // Relationship to PaymentSchedule
    public function paymentSchedule()
    {
        return $this->belongsTo(PaymentSchedule::class, 'payment_schedule_id');
    }

    /**
     * Define the relationship with the User model.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Approve the payment by setting the status to 'approved'.
     *
     * @return bool
     */
    public function approve()
    {
        $this->status = 'approved';
        return $this->save();
    }

    /**
     * Reject the payment by setting the status to 'rejected'.
     *
     * @return bool
     */
    public function reject()
    {
        $this->status = 'rejected';
        return $this->save();
    }


    /**
     * Get the most recent payment for a user.
     *
     * @param int $userId
     * @return Payment|null
     */
    public static function getMostRecentPaymentForUser(int $userId): ?Payment
    {
        return self::where('user_id', $userId)
            ->orderBy('created_at', 'desc') // Order by created_at in descending order
            ->first(); // Get the most recent payment
    }
}