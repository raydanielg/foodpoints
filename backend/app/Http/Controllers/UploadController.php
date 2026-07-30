<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UploadController extends Controller
{
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
            'type' => 'sometimes|string|in:logo,cover,avatar,menu_item',
        ]);

        $file = $request->file('file');
        $type = $request->input('type', 'general');

        $directory = 'uploads/' . $type;
        $path = $file->store($directory, 'public');

        return response()->json([
            'url' => '/storage/' . $path,
            'path' => $path,
        ]);
    }
}
