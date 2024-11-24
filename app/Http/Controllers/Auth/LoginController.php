<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function showLoginForm()
    {
        return view('auth.login'); 
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials, $request->filled('remember'))) {
            $user = Auth::user();
            $token = $user->createToken('LaravelAuthApp')->accessToken;

            return response()->json([
                'token' => $token,
                'usertype' => $user->usertype,
                'message' => 'Login successful!'
            ]);
        }

        return response()->json(['errors' => ['Invalid credentials.']], 401);
    }

}
