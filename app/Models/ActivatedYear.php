<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivatedYear extends Model
{
    protected $fillable = [
        'year',
        'is_active'
    ];
}
