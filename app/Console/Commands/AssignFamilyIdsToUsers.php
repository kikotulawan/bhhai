<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Family;
use Illuminate\Support\Facades\Log;

class AssignFamilyIdsToUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'assign:family-ids'; 

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Assign family_ids to users based on block and lot';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        // Fetch all users with a null family_id
        $users = User::whereNull('family_id')->get();

        // Iterate through each user
        foreach ($users as $user) {
            try {
                // Find or create a family based on block and lot
                $family = Family::firstOrCreate([
                    'block' => $user->block,
                    'lot' => $user->lot,
                ]);

                // Assign the family_id to the user
                $user->family_id = $family->id;
                $user->save();

                // Log success
                $this->info("Assigned family_id {$family->id} to user {$user->id}.");
                Log::info("Assigned family_id {$family->id} to user {$user->id}.");
            } catch (\Exception $e) {
                // Log any errors
                $this->error("Failed to assign family_id to user {$user->id}: " . $e->getMessage());
                Log::error("Failed to assign family_id to user {$user->id}: " . $e->getMessage());
            }
        }

        $this->info('Family IDs assigned successfully to all users.');
        return 0;
    }
}
