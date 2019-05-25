<?php
/**
 * Created by PhpStorm.
 * User: fabersoft
 * Date: 20/10/18
 * Time: 18:23
 */

namespace Bufallus\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Class ReportItemResource
 * @package Bufallus\Http\Resources
 */
class ReportItemResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            "item_id" => $this->item_id,
            "description" => $this->description,
            "quantity" => floatval($this->quantity),
            "price" => floatval($this->price),
            "cost" => floatval($this->cost),
            "discount" => floatval($this->discount)
        ];
    }
}
