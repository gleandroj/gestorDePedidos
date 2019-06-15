<?php
/**
 * Created by PhpStorm.
 * User: fabersoft
 * Date: 20/10/18
 * Time: 18:23
 */

namespace Bufallus\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            "id" => $this->id,
            "item_id" => $this->item_id,
            "quantity" => floatval($this->quantity),
            "created_at" => $this->created_at,
            "finalized_at" => $this->finalized_at,
            "is_done" => !!$this->finalized_at,
            "price" => floatval($this->price),
            "cost" => floatval($this->cost),
            "discount" => floatval($this->discount),
            "observation" => $this->observation
        ];
    }
}
