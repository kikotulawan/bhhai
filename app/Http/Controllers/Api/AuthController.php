<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
    
        $credentials = $request->only('email', 'password');
    
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;
    
            return response()->json([
                'token' => $token,
                'user' => $user,
                'usertype' => $user->usertype,
                'is_first_login' => $user->is_first_login,
            ]);
        }
    
        return response()->json(['message' => 'Invalid credentials'], 401);
    }
    
    
    public function logout(Request $request)
    {
        // Log the token for debugging
        \Log::info('Token:', [$request->bearerToken()]);

        try {
            // Revoke all tokens for the authenticated user
            $request->user()->tokens()->delete();
            return response()->json(['message' => 'Logged out successfully']);
        } catch (\Exception $e) {
            // Log any errors and return an error response
            \Log::error('Logout error:', ['exception' => $e]);
            return response()->json(['message' => 'Logout failed'], 500);
        }
    }

    public function status(Request $request)
    {
        // Check if the user is authenticated and return the user info
        return response()->json([
            'isAuthenticated' => auth()->check(),
            'user' => auth()->user(),
        ]);
    }
}
