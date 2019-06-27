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
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
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
     * @return Builder[]|Collection|AnonymousResourceCollection
     */
    public function index()
    {
        $filter = request('filter', []);
        $interval = $this->parseInterval($filter['interval'] ?? []);
        return OrderResource::collection(
            Order::orders($interval, $filter['updated_at'] ?? null, $filter['show_finalized'] ?? false)
        );
    }

    /**
     * @return \Closure
     */
    protected function mapItemFn()
    {
        return function ($item) {
            return array_merge($item, [
                'discount' => $item['discount'] ?? 0
            ]);
        };
    }

    /**
     * Display the specified resource.
     *
     * @param Order $order
     * @return OrderResource|Order
     */
    public function show(Order $order)
    {
        return new OrderResource($order);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param CreateOrUpdateOrderRequest $request
     * @return Response|OrderResource
     */
    public function store(CreateOrUpdateOrderRequest $request)
    {
        return new OrderResource(Order::query()->create($request->validated()));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param CreateOrUpdateOrderRequest $request
     * @param Order $order
     * @return Response|OrderResource|Order
     */
    public function update(CreateOrUpdateOrderRequest $request, Order $order)
    {
        $data = $request->except('items');
        $isDone = $request->get('is_done', false);

        if ($isDone) {
            $data['finalized_at'] = Carbon::now();
            $order->orderItems()->whereNull('finalized_at')->update(['finalized_at' => $data['finalized_at']]);
        } else {
            $data['finalized_at'] = null;
        }

        tap($order)->touch()->update(array_except($data, ['is_done']));

        return new OrderResource($order->refresh());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Order $order
     * @return array
     * @throws \Exception
     */
    public function destroy(Order $order)
    {
        $order->orderItems()->delete();
        return [
            'success' => boolval($order->delete())
        ];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Order $order
     * @return array
     * @throws \Exception
     */
    public function print(Order $order)
    {
        $order->print();
        return [
            'success' => true
        ];
    }
}
