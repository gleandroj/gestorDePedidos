<?php

namespace Bufallus\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Bufallus\Models\User;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    /**
     * @return \Illuminate\Contracts\Auth\Authenticatable|null|User
     */
    public function user()
    {
        return Auth::user();
    }


    /**
     * @param $interval
     * @return array
     */
    public function parseInterval($interval)
    {
        $timezone = config('app.timezone');
        $from = !empty($interval) && !empty($interval[0]) ? Carbon::parse($interval[0])->setTimezone($timezone)->startOfDay() : null;
        $to = !empty($interval) && !empty($interval[1]) ? Carbon::parse($interval[1])->setTimezone($timezone)->endOfDay() : null;
        return [$from, $to];
    }
}
