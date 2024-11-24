<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if the user is authenticated and if the user is an admin
        if (Auth::check() && Auth::user()->isAdmin()) {
            return $next($request); // Allow access if the user is an admin
        }

        // If the user is not an admin, redirect to the home page
        return redirect('/home')->with('error', 'You do not have access to this page.');
    }
}
