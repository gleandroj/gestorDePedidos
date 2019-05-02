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
        'created_at',
        'updated_at'
    ];

    /**
     * @param array $interval
     * @param null $lastUpdated
     * @return \Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Query\Builder[]|\Illuminate\Support\Collection
     */
    public static function orders(array $interval = [], $lastUpdated = null, $showFinalized = false)
    {
        $interval = $interval ?? [Carbon::now()->startOfDay(), Carbon::now()->endOfDay()];
        $q = static::query()
            ->whereBetween('created_at', $interval)
            ->orderBy('created_at', 'asc');

        if (!empty($lastUpdated) && !$showFinalized) {
            $q->where('updated_at', '>=', Carbon::parse($lastUpdated)->setTimezone(config('app.timezone')));
        }

        return $q->get();
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
