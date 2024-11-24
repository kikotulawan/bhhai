<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\SoftDeletes;

class BoardMember extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'user_id', 
        'position',
        'start_of_term',
        'end_of_term',
        'image',
    ];

    // Relationship: A board member belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Accessor to get the full image URL
    public function getImageUrlAttribute()
    {
        return asset('storage/' . $this->image);
    }

    // Automatically handle image deletion when the board member is deleted
    protected static function boot()
{
    parent::boot();

    static::deleting(function ($boardMember) {
        if (!$boardMember->isForceDeleting() && $boardMember->image) {
            // For soft delete, avoid deleting the image immediately
            return;
        }
        
        if ($boardMember->image) {
            // Delete the image from storage if it exists during force delete
            Storage::disk('public')->delete($boardMember->image);
        }
    });
}
}
