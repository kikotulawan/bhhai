<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlockAndLot extends Model
{
    protected $fillable = [
        'block',
        'lot',
        'status'
    ];
}
