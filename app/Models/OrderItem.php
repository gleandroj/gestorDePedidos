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
        'finalized_at',
        'paid_at',
        'parent_id'
    ];

    protected $casts = [];

    protected $dates = [
        'finalized_at',
        'paid_at'
    ];

    /**
     * @return mixed
     */
    public function computedPrice()
    {
        return $this->price - $this->discount;
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function children()
    {
        return $this->hasMany(OrderItem::class, 'parent_id');
    }
}
