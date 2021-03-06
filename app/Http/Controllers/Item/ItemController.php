<?php
/**
 * Created by PhpStorm.
 * User: fabersoft
 * Date: 10/03/19
 * Time: 19:17
 */

namespace Bufallus\Http\Controllers\Item;

use Bufallus\Http\Requests\CreateOrUpdateItemRequest;
use Bufallus\Http\Resources\ItemResource;
use Bufallus\Models\Item;
use Illuminate\Http\Request;
use Bufallus\Http\Controllers\Controller;

/**
 * Class OrderController
 * @package Bufallus\Http\Controllers\Item
 */
class ItemController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection|\Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function all()
    {
        return ItemResource::collection(
            Item::all()
        );
    }

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
     * @param CreateOrUpdateItemRequest $request
     * @return \Illuminate\Http\Response|ItemResource
     */
    public function store(CreateOrUpdateItemRequest $request)
    {
        return new ItemResource(Item::query()->create($request->validated()));
    }

    /**
     * Display the specified resource.
     *
     * @param  \Bufallus\Models\Item $item
     * @return ItemResource|Item
     */
    public function show(Item $item)
    {
        return new ItemResource($item);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param CreateOrUpdateItemRequest $request
     * @param  \Bufallus\Models\Item $item
     * @return \Illuminate\Http\Response|ItemResource|Item
     */
    public function update(CreateOrUpdateItemRequest $request, Item $item)
    {
        $item->update($request->validated());
        return new ItemResource($item->refresh());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \Bufallus\Models\Item $item
     * @return array
     * @throws \Exception
     */
    public function destroy(Item $item)
    {
        return [
            'success' => boolval($item->delete())
        ];
    }
}
