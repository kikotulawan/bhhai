<?php

namespace App\Events;

use App\Models\Notification;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\BroadcastEvent;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class UserNotification implements ShouldBroadcast
{
    public $userId;
    public $notification;

    // Accept a message and user_id in the constructor
    public function __construct($notification, $userId)
    {
        $this->userId = $userId;
        $this->notification = $notification;
    }

    // Specify the channel to broadcast on
    public function broadcastOn()
    {
        return new Channel('user.' . $this->userId); // Broadcast to the specific user channel
    }

    // Specify the event name for broadcasting
    public function broadcastAs()
    {
        return 'user-notification';
    }


    public function broadcastWith()
    {
        return [
            'message' => $this->notification,
        ];
    }
}