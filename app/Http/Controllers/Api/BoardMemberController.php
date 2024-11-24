<?php

namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller; 
use App\Models\BoardMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log; 
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;


class BoardMemberController extends Controller
{
    
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'position' => 'required|string|max:255',
            'start_of_term' => 'required|date',
            'end_of_term' => 'required|date|after:start_of_term',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', 
        ]);

        $imagePath = $this->handleImageUpload($request);

        $boardMember = BoardMember::create([
            'user_id' => $request->user_id,
            'position' => $request->position,
            'start_of_term' => $request->start_of_term,
            'end_of_term' => $request->end_of_term,
            'image' => $imagePath, 
        ]);

        $boardMember = BoardMember::with('user')->find($boardMember->id);
        return response()->json(['message' => 'Board member added successfully', 'data' => $boardMember], 201);
    }

    public function getBoardMembers()
    {
        try {
            $boardMembers = BoardMember::with('user')
                ->orderBy('start_of_term', 'asc')
                ->get();

            return response()->json($boardMembers);
        } catch (\Exception $e) {
            Log::error('Error retrieving board members: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(['error' => 'Failed to retrieve board members'], 500);
        }
    }

            // Update board member
            public function update(Request $request, $id)
            {
                
                Log::info('Request Data: ', $request->all());

                // Find the board member using the ID
                $boardMember = BoardMember::findOrFail($id);

                // Validate the incoming request
                $validatedData = $request->validate([
                    'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                    'user_id' => 'required|exists:users,id',
                    'position' => 'required|string|max:255',
                    'start_of_term' => 'required|date',
                    'end_of_term' => 'required|date|after:start_of_term',
                ]);

                // Handle the image upload
                $imagePath = $this->handleImageUpload($request, $boardMember);

                // Update the board member fields
                $boardMember->user_id = $validatedData['user_id'];
                $boardMember->position = $validatedData['position'];
                $boardMember->start_of_term = $validatedData['start_of_term'];
                $boardMember->end_of_term = $validatedData['end_of_term'];

                // Update image if a new one was uploaded
                if ($imagePath) {
                    $boardMember->image = $imagePath;
                }

                // Save the updated board member details
                $boardMember->save();

                // Return the updated board member with user details
                $updatedBoardMember = BoardMember::with('user')->find($boardMember->id);

                Log::info('Validated data:', $validatedData);

                return response()->json([
                    'message' => 'Board member updated successfully',
                    'data' => $updatedBoardMember,
                ], 200);
            }

            

            private function handleImageUpload(Request $request, BoardMember $boardMember = null)
            {
                if ($request->hasFile('image')) {
                    // Check and delete the old image if it exists
                    if ($boardMember && $boardMember->image) {
                        Storage::disk('public')->delete($boardMember->image);
                    }

                    // Get the uploaded file
                    $file = $request->file('image');
                    $originalFileName = $file->getClientOriginalName();

                    // Generate a unique file name using a timestamp to avoid overwriting
                    $uniqueFileName = time() . '_' . $originalFileName;

                    // Define the file path
                    $filePath = 'board_members/' . $uniqueFileName;

                    // Store the file with the unique name
                    Storage::disk('public')->putFileAs('board_members', $file, $uniqueFileName);

                    // Return the file path to be saved in the database
                    return $filePath;
                }

                // If no new image was uploaded, return the existing image path or null
                return $boardMember ? $boardMember->image : null;
            }

                                            

            // Delete board member
            public function destroy($id)
{
    // Find the board member including soft-deleted ones
    $boardMember = BoardMember::withTrashed()->find($id);

    if (!$boardMember) {
        return response()->json(['message' => 'Board member not found'], 404);
    }

    // Delete the associated image if it exists
    if ($boardMember->image) {
        Storage::disk('public')->delete($boardMember->image);
    }

    // Perform permanent deletion (force delete if soft-deleted)
    $boardMember->forceDelete();

    return response()->json(['message' => 'Board member deleted successfully']);
}
}