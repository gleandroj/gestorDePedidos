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
        $data = [
            "id" => $this->id,
            "item_id" => $this->item_id,
            "parent_id" => $this->parent_id,
            "quantity" => floatval($this->quantity),
            "price" => floatval($this->price),
            "cost" => floatval($this->cost),
            "discount" => floatval($this->discount),
            "observation" => $this->observation,
            "created_at" => $this->created_at,
            "finalized_at" => $this->finalized_at
        ];
        if (empty($this->parent_id)) {
            $data = array_merge($data, [
                'children' => OrderItemResource::collection($this->children)
            ]);
        }
        return $data;
    }
}
