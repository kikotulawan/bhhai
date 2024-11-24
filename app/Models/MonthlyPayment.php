<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MonthlyPayment extends Model
{
    protected $fillable = [
        'user_id',
        'transaction_reference',
        'amount',
        'proof_of_payment',
        'period_covered',
        'is_approved'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
