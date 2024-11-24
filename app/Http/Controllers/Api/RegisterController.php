<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class RegisterController extends Controller
{
    public function registerStep1(Request $request)
    {
        try {
            $request->validate([
                'firstName' => 'required|string|max:255',
                'middleName' => 'nullable|string|max:255',
                'lastName' => 'required|string|max:255',
                'gender' => 'required|string|max:255',
            ]);

            session([
                'firstName' => $request->firstName,
                'middleName' => $request->middleName,
                'lastName' => $request->lastName,
                'gender' => $request->gender,
            ]);

            return response()->json(['message' => 'Step 1 completed']);
        } catch (\Exception $e) {
            Log::error('Error in registerStep1: ' . $e->getMessage());
            return response()->json(['error' => 'Something went wrong', 'details' => $e->getMessage()], 500);
        }
    }

    public function registerStep2(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|string|email|max:255|unique:users',
                'contact_number' => 'nullable|string|max:255',
            ]);

            session([
                'email' => $request->email,
                'contact_number' => $request->contact_number,
            ]);

            return response()->json(['message' => 'Step 2 completed']);
        } catch (\Exception $e) {
            Log::error('Error in registerStep2: ' . $e->getMessage());
            return response()->json(['error' => 'Something went wrong', 'details' => $e->getMessage()], 500);
        }
    }

    public function registerStep3(Request $request)
    {
        // Start the database transaction
        DB::beginTransaction();
        try {
            // Validate the incoming request data
            $validatedData = $request->validate([
                'block' => 'required|string|max:255',
                'lot' => 'required|string|max:255',
                'proofOfResidency' => 'nullable|file|mimes:jpg,png,pdf|max:2048',
                'nameOfOwner' => 'nullable|string|max:255',
                'role' => 'required|string|in:Homeowner,Renter',
            ]);
    
            // Initialize user data array from session
            $requiredFields = ['firstName', 'middleName', 'lastName', 'gender', 'email', 'contact_number'];
            $userData = [];
            foreach ($requiredFields as $field) {
                if (empty(session($field))) {
                    DB::rollBack();
                    Log::error("Missing session data for field: {$field}");
                    return response()->json(['error' => 'Missing critical session data', 'missing_field' => $field], 400);
                }
                $userData[$field] = session($field);
            }
    
            // Generate a unique username
            $username = $this->generateUniqueUsername($userData['firstName'], $userData['lastName']);
    
            // Additional user data processing
            $userData += [
                'block' => $validatedData['block'],
                'lot' => $validatedData['lot'],
                'proofOfResidency' => $request->hasFile('proofOfResidency') ? $request->file('proofOfResidency')->store('proof_of_residency', 'public') : null,
                'password' => Hash::make('defaultpassword'),
                'role' => $validatedData['role'],
                'nameOfOwner' => $validatedData['role'] === 'Renter' ? $validatedData['nameOfOwner'] : null,
                'username' => $username, // Add the generated username
            ];
    
            // Create the user
            User::create($userData);
            session()->forget($requiredFields);
            DB::commit();
    
            return response()->json(['message' => 'Registration completed successfully.']);
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            // Handling validation errors
            return response()->json(['error' => 'Validation failed', 'details' => $e->errors()], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error in registerStep3: ' . $e->getMessage());
            // General exception handling
            return response()->json(['error' => 'Registration failed', 'details' => $e->getMessage()], 500);
        }
    }
    
    /**
     * Generate a unique username based on firstName and lastName.
     */
    private function generateUniqueUsername($firstName, $lastName)
    {
        // Convert to lowercase and combine first and last name
        $baseUsername = strtolower($firstName) . '.' . strtolower($lastName);
        $username = $baseUsername;
        $counter = 1;
    
        // Check if the username already exists in the users table
        while (User::where('username', $username)->exists()) {
            // If it exists, append a number to make it unique
            $username = $baseUsername . $counter;
            $counter++;
        }
    
        return $username;
    }

}
