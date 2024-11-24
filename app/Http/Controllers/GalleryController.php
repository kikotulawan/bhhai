<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class GalleryController extends Controller
{
    /**
     * Display a paginated listing of the images.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $images = Gallery::paginate(10); // Adjust the pagination count as needed

        return response()->json($images);
    }

    /**
     * Display a paginated listing of the images.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function latestImages(Request $request)
    {
        $images = Gallery::limit(5)->orderBy('created_at', 'DESC')->get(); 

        return response()->json($images);
    }

    public function allImages(Request $request)
{
    $images = Gallery::orderBy('created_at', 'DESC')->get(); 

    return response()->json($images);
}

    /**
     * Store a newly created image in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048', // Adjust size as needed
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $imagePath = $request->file('image')->store('images', 'public');

        $gallery = Gallery::create([
            'title' => $request->input('title'),
            'description' => $request->input('description'),
            'image_path' => $imagePath,
        ]);

        return response()->json($gallery, 201);
    }

    /**
     * Update the specified image in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $gallery = Gallery::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Adjust size as needed
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $gallery->title = $request->input('title');
        $gallery->description = $request->input('description');

        if ($request->hasFile('image')) {
            // Delete the old image
            Storage::disk('public')->delete($gallery->image_path);

            // Store the new image
            $imagePath = $request->file('image')->store('images', 'public');
            $gallery->image_path = $imagePath;
        }

        $gallery->save();

        return response()->json($gallery);
    }

    /**
     * Remove the specified image from storage.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $gallery = Gallery::findOrFail($id);

        // Delete the image file
        Storage::disk('public')->delete($gallery->image_path);

        $gallery->delete();

        return response()->json(['message' => 'Image deleted successfully']);
    }
}
