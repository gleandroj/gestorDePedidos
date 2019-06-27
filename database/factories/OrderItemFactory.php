<?php

use Bufallus\Models\Item;
use Bufallus\Models\OrderItem;
use Faker\Generator as Faker;

$factory->define(OrderItem::class, function (Faker $faker) {
    $item = factory(Item::class)->create();
    return [
        'observation' => $faker->text(30),
        'quantity' => $faker->numberBetween(1, 20),
        'price' => $item->price,
        'cost' => $item->cost,
        'discount' => 0,
        'item_id' => $item->id,
        'finalized_at' => $finalized = $faker->dateTimeBetween('-120 days', 'now'),
        'created_at' => $finalized
    ];
});
