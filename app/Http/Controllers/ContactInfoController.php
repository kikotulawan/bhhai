<?php

namespace App\Http\Controllers;

use App\Models\ContactInfo;
use Illuminate\Http\Request;

class ContactInfoController extends Controller
{
    public function show()
    {
        $contactInfo = ContactInfo::first();
        return response()->json($contactInfo);
    }

    public function update(Request $request)
    {
        $contactInfo = ContactInfo::first();
    
        $contactInfo->update([
            'company_name' => $request->companyName,
            'address' => $request->address,
            'email' => $request->email,
            'mobile_number' => $request->mobileNumber,
            'contact_number' => $request->contactNumber, 
            'telephone' => $request->telephone,
        ]);
    
        return response()->json(['message' => 'Contact information updated successfully!', 'data' => $contactInfo]);
    }
    
    public function store(Request $request)
    {
        $request->validate([
            'companyName' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'email' => 'required|email|unique:contact_info,email',
            'contactNumber' => 'required|string|max:20',
            'telephone' => 'required|string|max:20',
        ]);
    
        $contactInfo = ContactInfo::create([
            'company_name' => $request->companyName,
            'address' => $request->address,
            'email' => $request->email,
            'contact_number' => $request->contactNumber,
            'telephone' => $request->telephone,
        ]);
    
        return response()->json(['message' => 'Contact information created successfully', 'data' => $contactInfo], 201);
    }
}
