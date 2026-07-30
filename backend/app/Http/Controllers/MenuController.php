<?php

namespace App\Http\Controllers;

use App\Models\MenuCategory;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MenuController extends Controller
{
    // ===== Categories =====

    public function categoriesIndex(Request $request): JsonResponse
    {
        $categories = MenuCategory::where('restaurant_id', $request->user()->restaurant_id)
            ->orderBy('sort_order')
            ->with('items')
            ->get();
        return response()->json(['categories' => $categories]);
    }

    public function categoryStore(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sort_order' => 'sometimes|integer|min:0',
        ]);

        $category = MenuCategory::create([
            ...$validated,
            'restaurant_id' => $request->user()->restaurant_id,
        ]);
        return response()->json(['category' => $category], 201);
    }

    public function categoryUpdate(Request $request, $id): JsonResponse
    {
        $category = MenuCategory::where('restaurant_id', $request->user()->restaurant_id)
            ->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'sort_order' => 'sometimes|integer|min:0',
        ]);

        $category->update($validated);
        return response()->json(['category' => $category]);
    }

    public function categoryDestroy(Request $request, $id): JsonResponse
    {
        $category = MenuCategory::where('restaurant_id', $request->user()->restaurant_id)
            ->findOrFail($id);
        $category->delete();
        return response()->json(['message' => 'Category deleted']);
    }

    // ===== Items =====

    public function itemsIndex(Request $request): JsonResponse
    {
        $items = MenuItem::where('restaurant_id', $request->user()->restaurant_id)
            ->with('category')
            ->orderBy('name')
            ->get();
        return response()->json(['items' => $items]);
    }

    public function itemStore(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:menu_categories,id',
            'name' => 'required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'price' => 'required|numeric|min:0',
            'image_url' => 'sometimes|nullable|string',
            'prep_time_min' => 'sometimes|integer|min:0',
            'is_available' => 'sometimes|boolean',
        ]);

        $item = MenuItem::create([
            ...$validated,
            'restaurant_id' => $request->user()->restaurant_id,
        ]);
        return response()->json(['item' => $item], 201);
    }

    public function itemUpdate(Request $request, $id): JsonResponse
    {
        $item = MenuItem::where('restaurant_id', $request->user()->restaurant_id)
            ->findOrFail($id);

        $validated = $request->validate([
            'category_id' => 'sometimes|exists:menu_categories,id',
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'image_url' => 'sometimes|nullable|string',
            'prep_time_min' => 'sometimes|integer|min:0',
            'is_available' => 'sometimes|boolean',
        ]);

        $item->update($validated);
        return response()->json(['item' => $item]);
    }

    public function itemDestroy(Request $request, $id): JsonResponse
    {
        $item = MenuItem::where('restaurant_id', $request->user()->restaurant_id)
            ->findOrFail($id);
        $item->delete();
        return response()->json(['message' => 'Item deleted']);
    }
}
