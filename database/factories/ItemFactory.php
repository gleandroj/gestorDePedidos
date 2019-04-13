<?php

use Bufallus\Models\Item;
use Faker\Generator as Faker;

$factory->define(Item::class, function (Faker $faker) {
    return [
        'description' => $faker->numerify('Item ###'),
        'price' => $faker->randomNumber(1),
        'cost' => $faker->randomNumber(1)
    ];
});
