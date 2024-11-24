<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resident extends Model
{
    use HasFactory;

    protected $fillable = [
        'firstName', 'middleName', 'middleInitial', 
        'lastName', 'address', 'nameOfOwner', 
        'residency_status'
    ];
}
