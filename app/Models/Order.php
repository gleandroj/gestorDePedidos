<?php

namespace Bufallus\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;

class Order extends AbstractModel
{
    protected $fillable = [
        'table',
        'is_done',
        'finalized_at'
    ];

    protected $casts = [
        'is_done' => 'boolean'
    ];

    protected $dates = [
        'finalized_at',
        'created_at'
    ];

    /**
     * @param Builder $builder
     * @return Builder
     */
    public function scopeNotFinalized(Builder $builder)
    {
        return $builder->whereNull('finalized_at')
            ->orWhereBetween('finalized_at', [Carbon::now()->startOfDay(), Carbon::now()->endOfDay()])
            ->orderBy('created_at', 'asc');
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
