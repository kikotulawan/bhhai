<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\{UserPayment,Notification};
use App\Events\UserNotification; // Import the event class

class CheckDelayedPayments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'payments:check-delayed';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check for delayed payments every 3 minutes';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $delayedPayments = UserPayment::getDelayedAllPayments();

        $notifications = [];

        foreach ($delayedPayments as $group) {
            $notification = Notification::create([
                'message' => 'Please pay your DELAYED PAYMENTS!',
                'read' => false,
                'user_id' => $group['user']->id,
            ]);

            broadcast(new UserNotification($notification, $group['user']->id));
            $notifications[] = $notification;
        }
        
        $this->info('Checked delayed payments.');
    }
    
    protected function triggerAction($payment)
    {
        // Example: Log or send a notification
        $this->info("Delayed payment detected: {$payment}");
        // Add further logic here
    }
}
