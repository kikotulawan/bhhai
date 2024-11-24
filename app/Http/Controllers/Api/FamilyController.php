<?php

namespace App\Http\Controllers\Api;

use App\Models\{Family, UserPayment, MonthlyPayment};
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;

class FamilyController extends Controller
{

    public function updateAccountHolder(Request $request, $familyId)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        // Kunin ang user gamit ang user_id
        $user = User::findOrFail($request->input('user_id'));
    
        // Hanapin ang Family record gamit ang block at lot ng user
        $family = Family::where('block', $user->block)
                        ->where('lot', $user->lot)
                        ->firstOrFail();
    
        // I-reset ang `is_account_holder` ng lahat ng miyembro ng pamilya
        $familyMembers = User::where('block', $user->block)
                             ->where('lot', $user->lot)
                             ->get();
    
        foreach ($familyMembers as $member) {
            $member->is_account_holder = 0;
            $member->save();
        }
    
        // I-set ang `is_account_holder` ng bagong Account Holder sa 1
        $user->is_account_holder = 1;
        $user->save();
        
        $userPayments = UserPayment::where('user_id', $request->current_account_holder)->get();
        if($userPayments) {
            foreach ($userPayments as $userPayment) {
               $userPayment->user_id = $user->id;
               $userPayment->save();
            }
        }
        
        $monthlyPayments = MonthlyPayment::where('user_id', $request->current_account_holder)->get();
        if($monthlyPayments) {
            foreach ($monthlyPayments as $monthlyPayment) {
               $monthlyPayment->user_id = $user->id;
               $monthlyPayment->save();
            }
        }
    
        // I-update ang `account_holder_id` ng Family record
        $family->account_holder_id = $request->input('user_id');
        $family->save();
    
        return response()->json(['message' => 'Account holder updated successfully.']);
    }
    

    public function getFamilyDetails($block, $lot)
    {
        $family = Family::where('block', $block)
                        ->where('lot', $lot)
                        ->with(['accountHolder', 'members' => function($query) {
                            $query->where('role', '!=', 'Renter');
                        }])
                        ->first();

        if (!$family) {
            return response()->json(['error' => 'Family not found'], 404);
        }

        return response()->json($family);
    }

    public function getFamilyTenantDetails($block, $lot)
    {
        $family = Family::where('block', $block)
                        ->where('lot', $lot)
                        ->with(['tenants' => function($query) {
                            $query->where('role', 'Renter');
                        }])
                        ->first();

        if (!$family) {
            return response()->json(['error' => 'Family not found'], 404);
        }

        return response()->json($family);
    }

    
    
    
}
