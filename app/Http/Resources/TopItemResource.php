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
 * Class TopItemResource
 * @package Bufallus\Http\Resources
 */
class TopItemResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            "item_id" => $this->item_id,
            "count" => $this->count,
            "item" => $this->item->description
        ];
    }
}
