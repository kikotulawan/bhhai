<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    public function index()
    {
        // Get all feedback entries
        return response()->json(Feedback::all());
    }
   
    public function store(Request $request)
    {
        // Validate the incoming feedback data
        $validated = $request->validate([
            'username_or_email' => 'required|string|max:255',
            'message' => 'required|string|max:500',
            'rating' => 'required|integer|min:1|max:5',
        ]);
    
        // If validation is successful, create a new feedback entry in the database
        Feedback::create([
            'username_or_email' => $request->username_or_email,
            'message' => $request->message,
            'rating' => $request->rating,
        ]);
    
        // Return a success response
        return response()->json(['message' => 'Feedback submitted successfully'], 201);
    }
    
}
