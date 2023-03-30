<?php

namespace App\Http\Controllers;

use App\Models\User;
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

        User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => bcrypt($validatedData['password']),
        ]);

        $accessToken = auth('api')->attempt($validatedData);

        return response()->json([
            'access_token' => $accessToken
        ]);
    }

    public function login(Request $request)
    {
        dd('in login', $request->input());
    }
}
