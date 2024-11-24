<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AnnouncementController extends Controller
{
    // Fetch all announcements
    public function index()
    {
        try {
            $announcements = Announcement::all();
            return response()->json($announcements);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch announcements'], 500);
        }
    }

    // Store a new announcement
    public function store(Request $request)
    {
        // Update the validation rules
        $validated = $request->validate([
            'media' => 'required|file|mimes:jpeg,png,jpg,gif,mp4,mov,avi,pdf|max:20480', 
            'title' => 'required|string|max:255',
            'details' => 'required|string',
            'posted_date' => 'required|date',
        ]);
    
        try {
            // Get the original file name and sanitize it
            $originalName = $request->file('media')->getClientOriginalName();
            $path = $request->file('media')->storeAs('media', $originalName, 'public');
    
            // Create the announcement with the stored media path
            $announcement = Announcement::create([
                'image' => $path, // Adjust this field name if needed for your database
                'title' => $validated['title'],
                'details' => $validated['details'],
                'posted_date' => $validated['posted_date'],
            ]);
    
            return response()->json($announcement, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to add announcement. Please try again later.'], 500);
        }
    }

    public function show($id)
    {
        try {
            $announcement = Announcement::findOrFail($id);
    
            // Check if the user has already viewed this announcement by checking the cookie
            if (!request()->cookie('viewed_announcement_' . $id)) {
                // Use raw query to increment views without modifying timestamps
                \DB::table('announcements')
                    ->where('id', $id)
                    ->increment('views'); // Only increment the views field
    
                // Set a cookie to last for 20 years (10512000 minutes)
                return response()->json($announcement)
                    ->cookie('viewed_announcement_' . $id, true, 10512000); // 20 years
            }
    
            // If cookie is present, just return the announcement without incrementing views
            return response()->json($announcement);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch announcement'], 500);
        }
    }
    

    // Update an announcement
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'details' => 'required|string',
            'posted_date' => 'required|date',
        ]);

        try {
            $announcement = Announcement::findOrFail($id);
            $announcement->update($validated);

            return response()->json($announcement);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update announcement. Please try again later.'], 500);
        }
    }

    // Delete an announcement
    public function destroy($id)
    {
        try {
            $announcement = Announcement::findOrFail($id);
            Storage::disk('public')->delete($announcement->image);
            $announcement->delete();

            return response()->json(['status' => 'success']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete announcement. Please try again later.'], 500);
        }
    }

    // Increment the views of an announcement
    public function incrementViews($id)
    {
        try {
            $announcement = Announcement::findOrFail($id);
            
            // Use DB::table to directly increment views without touching the timestamps
            \DB::table('announcements')
                ->where('id', $id)
                ->increment('views'); // Only increment the views field
    
            return response()->json(['status' => 'success', 'views' => $announcement->views + 1], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to increment views'], 500);
        }
    }

    // Fetch the latest 2 announcements
public function latest()
{
    try {
        // Fetch the latest 2 announcements, ordered by 'posted_date'
        $announcements = Announcement::orderBy('posted_date', 'desc')->take(4)->get();
        return response()->json($announcements);
    } catch (\Exception $e) {
        \Log::error('Failed to fetch latest announcements: ' . $e->getMessage());
        return response()->json(['error' => 'Failed to fetch latest announcements'], 500);
    }
}
}
