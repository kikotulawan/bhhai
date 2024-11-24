<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',       // Foreign key referencing the users table
        'amount',        // Payment amount in centavos
        'description',   // Description of the payment
        'remarks',       // Optional remarks
        'due_date',      // Due date for the payment
        'status', 
        'start_date',
        'end_date',       // Payment status (e.g., Pending, Paid)
    ];

    /**
     * Define the relationship with the User model.
     * Each payment schedule belongs to a specific user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'payment_schedule_id');
    }

    public function getStartDateAttribute($value)
{
    return \Carbon\Carbon::parse($value)->format('Y-m-d');
}

public function getEndDateAttribute($value)
{
    return \Carbon\Carbon::parse($value)->format('Y-m-d');
}
}
