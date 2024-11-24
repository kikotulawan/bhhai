<?php

namespace Database\Seeders;

use App\Models\BlockAndLot;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        BlockAndLot::create([
            'block' => 1,
            'lot' => 1,
            'status' => 'Unoccupied'
        ]);

        BlockAndLot::create([
            'block' => 1,
            'lot' => 2,
            'status' => 'Unoccupied'
        ]);

        $years = [];

        for ($year = 2023; $year <= 2099; $year++) {
            $years[] = [
                'year' => $year,
                'is_active' => in_array($year, [2023, 2024]), // Set active only for 2023 and 2024
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // Insert into database
        DB::table('activated_years')->insert($years);
    }
}
