<?php
/**
 * Created by PhpStorm.
 * User: fabersoft
 * Date: 10/03/19
 * Time: 19:17
 */

namespace Bufallus\Http\Controllers\Menu;

use Bufallus\Http\Resources\MenuResource;
use Bufallus\Models\Menu;
use Illuminate\Http\Request;
use Bufallus\Http\Controllers\Controller;

/**
 * Class MenuController
 * @package Bufallus\Http\Controllers\Menu
 */
class MenuController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection|\Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        return MenuResource::collection(
            Menu::paginate(
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
     * @return \Illuminate\Http\Response|MenuResource
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'item' => 'string'
        ]);
        return new MenuResource(Menu::query()->create($request->only('item')));
    }

    /**
     * Display the specified resource.
     *
     * @param  \Bufallus\Models\Menu $menu
     * @return MenuResource|Menu
     */
    public function show(Menu $menu)
    {
        return new MenuResource($menu);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Bufallus\Models\Menu $menu
     * @return \Illuminate\Http\Response|MenuResource|Menu
     */
    public function update(Request $request, Menu $menu)
    {
        $this->validate($request, [
            'item' => 'string'
        ]);
        $menu->update($request->only('item'));
        return new MenuResource($menu->refresh());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \Bufallus\Models\Menu $menu
     * @return array
     * @throws \Exception
     */
    public function destroy(Menu $menu)
    {
        return [
            'success' => boolval($menu->delete())
        ];
    }
}
