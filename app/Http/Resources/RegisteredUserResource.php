<?php

namespace Bufallus\Http\Resources;

use Bufallus\Support\Resources\ApiResource;

class RegisteredUserResource extends ApiResource
{

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'message' => trans('auth.registration', [
                'name' => $this->name
            ])
        ];
    }
}
