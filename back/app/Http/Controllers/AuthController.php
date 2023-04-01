<?php

namespace App\Http\Controllers;

use App\Models\User;
use Elastic\Elasticsearch\ClientBuilder;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    // 新規ユーザー
    public function createAccount(Request $request)
    {
        $validatedData = $request->validate([
            'email' => 'required|unique:users|email|max:255',
            'name' => 'required|unique:users|max:255',
            'password' => 'required|confirmed|max:255',
        ]);

        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => bcrypt($validatedData['password']),
        ]);

        $accessToken = auth('api')->attempt($validatedData);

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'access_token' => $accessToken
        ]);
    }

    public function login(Request $request)
    {
        $validatedData = $request->validate([
            'email' => 'required|email|max:255',
            'password' => 'required|max:255',
        ]);

        if (!$accessToken = auth('api')->attempt($validatedData)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $user = auth('api')->user();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'access_token' => $accessToken
        ]);
    }

    public function logout()
    {
        auth('api')->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    public function me()
    {
        $user = auth('api')->user();
        return response()->json([
            'id' => $user->id,
            'name' => $user->name
        ]);
    }
}
