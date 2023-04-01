<?php

namespace App\Http\Middleware;

use Closure;
use ReflectionClass;

class EnableCrossRequestMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $response = $next($request);
        $origin = $request->server('HTTP_ORIGIN') ? $request->server('HTTP_ORIGIN') : '';

        $response->headers->add([
            'Access-Control-Allow-Origin' => $origin,
            'Access-Control-Allow-Headers' => '*',
            'Access-Control-Allow-Methods' => 'GET, POST, PATCH, PUT,DELETE, OPTIONS',
            'Access-Control-Allow-Credentials' => 'true'
        ]);

        return $response;
    }
}
