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
            "quantity" => $this->quantity,
            "observation" => $this->observation,
            "is_done" => $this->is_done
        ];
    }
}
