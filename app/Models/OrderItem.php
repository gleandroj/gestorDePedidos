<?php

namespace Bufallus\Models;

class OrderItem extends AbstractModel
{

    protected $fillable = [
        'observation',
        'quantity',
        'price',
        'cost',
        'discount',
        'item_id',
        'order_id',
        'finalized_at'
    ];

    protected $casts = [];

    protected $dates = [
        'finalized_at'
    ];

    public function computedPrice()
    {
        return $this->price - $this->discount;
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function item()
    {
        return $this->belongsTo(Item::class);
    }
}
