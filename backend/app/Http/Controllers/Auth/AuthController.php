<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // Handle user registration

        // Validate requests
        $fields = $request->validate([
            'first_name' => 'required|max:255',
            'last_name' => 'required|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|confirmed'
        ]);

        // Create user
        $user = User::create([
            'first_name' => $fields['first_name'],
            'last_name' => $fields['last_name'],
            'email' => $fields['email'],
            'password' => Hash::make($fields['password'])
        ]);

        // Handle access tokens
        $token = $user->createToken($request->first_name);

        // Return the user and the token as response along with plain text token
        return  [
            'user' => $user,
            'token' => $token->plainTextToken
        ];
    }

    public function login(Request $request)
    {
        // Handle user login

        // Validate the requests
        $request->validate([
            'email' => 'required|email|exists:users',
            'password' => 'required'
        ]);

        // Check the email first of the user
        $user = User::where('email', $request->email)->first();

        // If the user does not exist or the password does not match
        if (!$user || ! Hash::check($request->password, $user->password)) {
            return [
                'message' => 'The provided credentials are incorrect'
            ];
        }

        // If matched, create a token for the user
        $token = $user->createToken($user->first_name);

        return [
            'user' => $user,
            'token' => $token->plainTextToken
        ];
    }

    public function logout(Request $request)
    {
        // Handle user logout
        $request->user()->tokens()->delete();

        return [
            'message' => 'You are logged out'
        ];
    }
}
