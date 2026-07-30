<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class OwnerMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check() || auth()->user()->role !== 'owner') {
            return redirect()->route('owner.login');
        }

        if (!auth()->user()->restaurant) {
            auth()->logout();
            return redirect()->route('owner.login')->withErrors(['phone' => 'No restaurant found.']);
        }

        return $next($request);
    }
}
