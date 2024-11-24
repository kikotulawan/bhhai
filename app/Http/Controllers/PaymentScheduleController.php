<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\PaymentSchedule;
use Illuminate\Http\Request;
use GuzzleHttp\Client;
use App\Models\User;
use App\Models\Payment;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;
use App\Mail\PaymentScheduleCreatedMail;

class PaymentScheduleController extends Controller
{
   
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'selectedHolders' => 'required|array',
            'dueDate' => 'required|date',
            'endMonth' => 'required|date_format:Y-m',
            'amount' => 'required|integer',
            'scheduleDetails' => 'required|string',
        ]);
    
        $startDate = Carbon::parse($validatedData['dueDate']);
        $endDate = Carbon::parse($validatedData['endMonth'])->endOfMonth();
        $scheduleIds = [];
    
        // Loop through each holder and create PaymentSchedules with start_date and end_date
        foreach ($validatedData['selectedHolders'] as $holderId) {
            $currentDate = $startDate->copy();
    
            while ($currentDate->lessThanOrEqualTo($endDate)) {
                $paymentSchedule = PaymentSchedule::create([
                    'user_id' => $holderId,
                    'amount' => $validatedData['amount'],
                    'description' => $validatedData['scheduleDetails'],
                    'due_date' => $currentDate->format('Y-m-d'), // Monthly due date
                    'start_date' => $startDate,   // Automatically handled by the model accessor
                    'end_date' => $endDate,       // Automatically handled by the model accessor
                    'status' => 'unpaid',
                ]);
    
                $scheduleIds[] = $paymentSchedule->id;
                $currentDate->addMonth();
            }
        }
    
        return response()->json([
            'message' => 'Schedules created successfully',
            'scheduleIds' => $scheduleIds
        ], 201);
    }
    


    
    public function fetchaccountholders(Request $request)
    {
         // Kunin ang mga account holders lamang
            $users = User::where('is_account_holder', 1)
            ->when($request->filled('block'), function ($query) use ($request) {
                $query->where('block', $request->block);
            })
            ->get(['id', 'firstName', 'lastName', 'block', 'lot']);

        return response()->json($users);
    }

    public function index()
    {
        $schedules = PaymentSchedule::with('user')->get();
        return response()->json($schedules);
    }

    public function fetchUserSchedules($user_id) {
        $schedules = PaymentSchedule::where('user_id', $user_id)->get();
        return response()->json($schedules);
    }

}
