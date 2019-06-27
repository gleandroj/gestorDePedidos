<?php
/**
 * Created by PhpStorm.
 * User: fabersoft
 * Date: 20/10/18
 * Time: 18:23
 */

namespace Bufallus\Http\Resources;

use Bufallus\Models\Order;
use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Class OrderResource
 * @package Bufallus\Http\Resources
 */
class OrderResource extends JsonResource
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return array
     */
    public function toArray($request)
    {
        /** @var Order $order */
        $order = $this->resource;
        return [
            "id" => $this->id,
            "table" => $this->table,
            "finalized_at" => $this->finalized_at,
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at,
            "items" => OrderItemResource::collection($order->orderItems(true)->get())
        ];
    }
}
