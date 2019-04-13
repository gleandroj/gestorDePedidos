<?php

namespace Bufallus\Models;

use Carbon\Carbon;

class Order extends AbstractModel
{
    protected $fillable = [
        'table',
        'finalized_at'
    ];

    protected $casts = [];

    protected $dates = [
        'finalized_at',
        'created_at'
    ];

    /**
     * @param null $from
     * @param null $to
     * @return \Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Query\Builder[]|\Illuminate\Support\Collection
     */
    public static function notFinalized($from = null, $to = null)
    {
        $interval = [$from ?? Carbon::now()->startOfDay(), $to ?? Carbon::now()->endOfDay()];
        return static::query()->whereNull('finalized_at')
            ->orWhereBetween('created_at', $interval)
            ->orderBy('created_at', 'asc')
            ->get();
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
