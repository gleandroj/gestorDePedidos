<?php
/**
 * Created by PhpStorm.
 * User: fabersoft
 * Date: 20/10/18
 * Time: 18:23
 */

namespace Bufallus\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            "id" => $this->id,
            "created_at" => $this->created_at,
            "table" => $this->table,
            "finalized_at" => $this->finalized_at,
            "is_done" => !!$this->finalized_at,
            "total_price" => $this->items->reduce(function ($total, $item) {
                return $total + $item->computedPrice();
            }, 0),
            "items" => OrderItemResource::collection($this->items)
        ];
    }
}
