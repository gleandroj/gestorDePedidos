<?php

namespace Bufallus\Models;

use Illuminate\Database\Eloquent\Builder;

class Order extends AbstractModel
{
    protected $fillable = [
        'table',
        'is_done'
    ];

    protected $casts = [
        'is_done' => 'boolean'
    ];

    /**
     * @param Builder $builder
     * @return Builder
     */
    public function scopeNotFinalized(Builder $builder)
    {
        return $builder->where('is_done', false);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
