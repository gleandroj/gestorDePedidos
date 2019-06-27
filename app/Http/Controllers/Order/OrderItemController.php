<?php
/**
 * Created by PhpStorm.
 * User: fabersoft
 * Date: 10/03/19
 * Time: 19:17
 */

namespace Bufallus\Http\Controllers\Order;

use Bufallus\Http\Requests\CreateOrUpdateOrderItemRequest;
use Bufallus\Http\Resources\OrderItemResource;
use Bufallus\Models\Order;
use Bufallus\Http\Controllers\Controller;
use Bufallus\Models\OrderItem;
use Carbon\Carbon;

/**
 * Class OrderItemController
 * @package Bufallus\Http\Controllers\Order
 */
class OrderItemController extends Controller
{
    /**
     * @param Order $order
     * @param CreateOrUpdateOrderItemRequest $request
     * @return OrderItemResource
     */
    public function store(Order $order, CreateOrUpdateOrderItemRequest $request)
    {
        return new OrderItemResource($order->orderItems()->create($request->validated()));
    }

    /**
     * @param Order $order
     * @param CreateOrUpdateOrderItemRequest $request
     * @param OrderItem $orderItem
     * @return OrderItemResource
     */
    public function update(Order $order, CreateOrUpdateOrderItemRequest $request, OrderItem $orderItem)
    {
        $data = collect($request->validated());
        if ($data->get('is_done', false)) {
            $data['finalized_at'] = Carbon::now();
        } else {
            $data['finalized_at'] = null;
        }
        $orderItem->children()->update(['finalized_at' => $data['finalized_at']]);
        $orderItem->update($data->all());
        return new OrderItemResource($orderItem->fresh());
    }

    /**
     * @param Order $order
     * @param OrderItem $orderItem
     * @return array
     * @throws \Exception
     */
    public function destroy(Order $order, OrderItem $orderItem)
    {
        return [
            'success' => $orderItem->delete()
        ];
    }
}
