<?php
/**
 * Created by PhpStorm.
 * User: fabersoft
 * Date: 20/10/18
 * Time: 18:23
 */

namespace Bufallus\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PaginateUserResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            "birthday" => $this->birthday,
            "cellphone" => $this->cellphone,
            "email" => $this->email,
            "gender" => $this->gender,
            "id" => $this->id,
            "name" => $this->name,
            "role" => $this->role
        ];
    }
}