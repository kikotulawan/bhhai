<?php

namespace App\Imports;

use App\Models\Resident;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\Log;

class ResidentsImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        // Log the row for debugging purposes
        Log::info('Processing row: ', $row);
    
        if (
            !empty($row['first_name']) && 
            !empty($row['last_name']) && 
            !empty($row['address']) && 
            !empty($row['residency_status'])
        ) {
            return new Resident([
                'firstName' => $row['first_name'],
                'middleName' => $row['middle_name'] ?? null,
                'middleInitial' => $row['middle_initial'] ?? null,
                'lastName' => $row['last_name'],
                'address' => $row['address'],
                'nameOfOwner' => $row['name_of_owner'] ?? null,
                'residency_status' => $row['residency_status'],
            ]);
        }
    
        // Log the row that was skipped
        Log::warning('Skipped row due to missing required fields: ', $row);
        return null;
    }
}
