<?php
/**
 * Created by PhpStorm.
 * User: fabersoft
 * Date: 10/03/19
 * Time: 19:17
 */

namespace Bufallus\Http\Controllers\Item;

use Bufallus\Http\Resources\ItemResource;
use Bufallus\Models\Item;
use Illuminate\Http\Request;
use Bufallus\Http\Controllers\Controller;

/**
 * Class ItemController
 * @package Bufallus\Http\Controllers\Item
 */
class ItemController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection|\Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        return ItemResource::collection(
            Item::paginate(
                request('per_page', 10),
                request('order_by', 'id'),
                request('direction', null),
                array_get(request('filter', []), 'query')
            )
        );
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response|ItemResource
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'description' => 'string'
        ]);
        return new ItemResource(Item::query()->create($request->only('description')));
    }

    /**
     * Display the specified resource.
     *
     * @param  \Bufallus\Models\Item $menu
     * @return ItemResource|Item
     */
    public function show(Item $menu)
    {
        return new ItemResource($menu);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Bufallus\Models\Item $menu
     * @return \Illuminate\Http\Response|ItemResource|Item
     */
    public function update(Request $request, Item $menu)
    {
        $this->validate($request, [
            'description' => 'string'
        ]);
        $menu->update($request->only('description'));
        return new ItemResource($menu->refresh());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \Bufallus\Models\Item $menu
     * @return array
     * @throws \Exception
     */
    public function destroy(Item $menu)
    {
        return [
            'success' => boolval($menu->delete())
        ];
    }
}
