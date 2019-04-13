<?php
/**
 * Created by PhpStorm.
 * User: fabersoft
 * Date: 10/03/19
 * Time: 19:17
 */

namespace Bufallus\Http\Controllers\Order;

use Bufallus\Http\Requests\CreateOrUpdateOrderRequest;
use Bufallus\Http\Resources\OrderResource;
use Bufallus\Models\Order;
use Bufallus\Http\Controllers\Controller;
use Illuminate\Support\Carbon;

/**
 * Class OrderController
 * @package Bufallus\Http\Controllers\Order
 */
class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection|\Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        $filter = request('filter', []);
        $interval = $this->parseInterval($filter['interval'] ?? []);
        return OrderResource::collection(
            Order::notFinalized($interval[0], $interval[1])
        );
    }

    protected function mapItemFn()
    {
        return function($item){
            return array_merge($item, [
                'discount' => $item['discount'] ?? 0
            ]);
        };;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param CreateOrUpdateOrderRequest $request
     * @return \Illuminate\Http\Response|OrderResource
     */
    public function store(CreateOrUpdateOrderRequest $request)
    {
        $order = new Order($request->only('table'));
        tap($order)->save()->items()->createMany(collect($request->get('items'))->map($this->mapItemFn())->all());
        return new OrderResource($order->refresh());
    }

    /**
     * Display the specified resource.
     *
     * @param  \Bufallus\Models\Order $order
     * @return OrderResource|Order
     */
    public function show(Order $order)
    {
        return new OrderResource($order);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param CreateOrUpdateOrderRequest $request
     * @param  \Bufallus\Models\Order $order
     * @return \Illuminate\Http\Response|OrderResource|Order
     */
    public function update(CreateOrUpdateOrderRequest $request, Order $order)
    {
        $data = $request->except('items');
        $isDone = $request->get('is_done', false);
        if ($isDone) {
            $data['finalized_at'] = Carbon::now();
        } else {
            $data['finalized_at'] = null;
        }
        $order->update(array_except($data, ['is_done']));
        collect($request->get('items'))->map($this->mapItemFn())->each(function($item){
            if (!empty($item['is_done']) && $item['is_done'] || $isDone) {
                $item['finalized_at'] = Carbon::now();
            } else {
                $item['finalized_at'] = null;
            }
            $order->items()->updateOrCreate([
                'id' => $item['id'] ?? null
            ], array_except($item, ['is_done']));
        });
        return new OrderResource($order->refresh());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \Bufallus\Models\Order $order
     * @return array
     * @throws \Exception
     */
    public function destroy(Order $order)
    {
        $order->items()->delete();
        return [
            'success' => boolval($order->delete())
        ];
    }
}
