<?php

use Bufallus\Models\Item;
use Faker\Generator as Faker;

$factory->define(Item::class, function (Faker $faker) {
    return [
        'description' => $faker->numerify('Item ###'),
        'price' => $faker->numberBetween(1, 30),
        'cost' => $faker->numberBetween(1, 30)
    ];
});
