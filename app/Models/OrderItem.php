<?php

namespace Bufallus\Models;

class OrderItem extends AbstractModel
{

    protected $fillable = [
        'observation',
        'is_done',
        'item_id',
        'order_id'
    ];

    protected $casts = [
        'is_done' => 'boolean'
    ];

    protected function order()
    {
        return $this->belongsTo(Order::class);
    }

    protected function item()
    {
        return $this->belongsTo(Item::class);
    }
}
