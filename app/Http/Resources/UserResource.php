<?php
/**
 * Created by PhpStorm.
 * User: fabersoft
 * Date: 20/10/18
 * Time: 18:23
 */

namespace Bufallus\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            "id" => $this->id,
            "birthday" => Carbon::parse($this->birthday)->format('d/m/Y'),
            "cellphone" => $this->cellphone,
            "email" => $this->email,
            "gender" => $this->gender,
            "name" => $this->name,
            "role" => $this->role
        ];
    }
}
