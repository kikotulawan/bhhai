<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\{User, Notification,Family}; // Import the model
use App\Notifications\{NewMessageNotification}; // Import the notification class
use App\Events\{UserNotification}; // Import the event class
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function sendNotification(Request $request)
    {
        $userIds = $request->userIds; // Expecting an array of user IDs
        $notifications = [];

        foreach ($userIds as $userId) {
            $user = User::find($userId);
            if ($user) {
                $notification = Notification::create([
                    'message' => $request->message,
                    'read' => false,
                    'user_id' => $user->id,
                ]);

                broadcast(new UserNotification($notification, $user->id));
                $notifications[] = $notification;
            }
        }

        if (count($notifications) > 0) {
            return response()->json(['status' => 'Notifications sent to users!']);
        }

        return response()->json(['status' => 'No valid users found'], 404);
    }


    public function markAsRead($notificationId)
    {
        $notification = Notification::find($notificationId);

        if ($notification) {
            $notification->update(['read' => true]);
            return response()->json(['status' => 'Notification marked as read']);
        }

        return response()->json(['status' => 'Notification not found'], 404);
    }

    public function getNotifications($userId)
    {
        return Notification::where('user_id', $userId)->latest()->take(50)->get();
    }

    public function getAllNotifications(Request $request)
    {
        $search = $request->input('search', ''); // Get search term, default to an empty string
        $perPage = $request->input('per_page', 10); // Items per page, default to 10

        $notifications = Notification::when($search, function ($query, $search) {
                $query->where('message', 'like', '%' . $search . '%'); // Search in the 'message' field
            })
            ->with('user')
            ->latest()
            ->paginate($perPage); // Paginate with specified number of items per page

        return response()->json($notifications);
    }

    public function getAllUsers(Request $request)
{
    $query = User::query();

    // Check kung may `block` parameter at mag-filter batay sa block
    if ($request->has('block') && !empty($request->block)) {
        $query->where('block', $request->block);
    }

    $users = $query->where('role', '!=', 'Administrator')->get(['id', 'firstName', 'lastName', 'email', 'block']); // piliin lang ang mga fields na kailangan mo
    $formattedUsers = $users->map(function ($user) {
        return [
            'label' => $user->firstName . ' ' . $user->lastName,
            'value' => $user->id
        ];
    });
    return response()->json($formattedUsers);
}
    public function getBlocks()
    {
        try {
            $blocks = User::select('block')->where('role', '!=', 'Administrator')->distinct()->pluck('block');

            return response()->json($blocks);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error fetching blocks'], 500);
        }
    }
}