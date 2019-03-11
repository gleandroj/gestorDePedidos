<?php
/**
 * Created by PhpStorm.
 * User: fabersoft
 * Date: 19/09/18
 * Time: 15:16
 */

namespace Bufallus\Support\Resources;


use Illuminate\Http\Resources\Json\Resource;

class ApiResource extends Resource
{
    public $additional = [
        'success' => true
    ];
}