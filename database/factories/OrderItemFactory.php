<?php

use Bufallus\Models\Item;
use Bufallus\Models\OrderItem;
use Faker\Generator as Faker;

$factory->define(OrderItem::class, function (Faker $faker) {
    $item = factory(Item::class)->create();
    return [
        'observation' => $faker->realText(),
        'quantity' => $faker->randomNumber(1),
        'price' => $item->price,
        'cost' => $item->cost,
        'discount' => $faker->randomNumber(1),
        'item_id' => $item->id,
        'finalized_at' => $finalized = $faker->dateTimeBetween('-120 days', 'now'),
        'created_at' => $finalized
    ];
});
