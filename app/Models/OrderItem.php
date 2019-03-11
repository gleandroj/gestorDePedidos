<?php

namespace Bufallus\Models;

class OrderItem extends AbstractModel
{

    protected $fillable = [
        'observation',
        'is_done',
        'quantity',
        'price',
        'cost',
        'discount',
        'item_id',
        'order_id'
    ];

    protected $casts = [
        'is_done' => 'boolean'
    ];

    protected $dates = [
        'finalized_at'
    ];

    public function computedPrice()
    {
        return $this->price - $this->discount;
    }

    protected function order()
    {
        return $this->belongsTo(Order::class);
    }

    protected function item()
    {
        return $this->belongsTo(Item::class);
    }
}
