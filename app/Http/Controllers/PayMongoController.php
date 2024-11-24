<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PayMongoController extends Controller
{
    public function createPaymentLink(Request $request)
    {
        // PayMongo API credentials
        $api_key = "sk_test_1bq1PGM8iEBp9g1NqvkUdBZ4";
        $api_url = "https://api.paymongo.com/v1/links";

        // Get the amount and description from the request
        $amount = $request->input('amount'); // Amount in centavos (e.g., 10000 for PHP 100.00)
        $description = $request->input('description');
        $remarks = $request->input('remarks');

        // Prepare the data for the request
        $data = [
            "data" => [
                "attributes" => [
                    "amount" => $amount,
                    "description" => $description,
                    "remarks" => $remarks
                ]
            ]
        ];

        // Initialize cURL session
        $ch = curl_init($api_url);

        // Set cURL options
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Content-Type: application/json",
            "Accept: application/json"
        ]);
        curl_setopt($ch, CURLOPT_USERPWD, "$api_key:"); // Basic Auth with only the username (API key)
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

        // Execute cURL request
        $response = curl_exec($ch);

        // Check for errors in the cURL request
        if (curl_errno($ch)) {
            return response()->json(['error' => curl_error($ch)], 500);
        }

        // Close cURL session
        curl_close($ch);

        // Decode JSON response
        $response_data = json_decode($response, true);

        // Get the checkout URL
        if (isset($response_data['data']['attributes']['checkout_url'])) {
            $checkout_url = $response_data['data']['attributes']['checkout_url'];
            return response()->json(['checkout_url' => $checkout_url]);
        } else {
            return response()->json(['error' => 'Unable to retrieve checkout URL.', 'details' => $response_data], 500);
        }
    }
}
