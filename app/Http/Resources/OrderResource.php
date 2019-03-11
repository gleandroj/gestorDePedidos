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
            "created_at" => $this->created_at->toIso8601String(),
            "table" => $this->table,
            "is_done" => $this->is_done,
            "items" => OrderItemResource::collection($this->items)
        ];
    }
}
