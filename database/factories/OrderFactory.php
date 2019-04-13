<?php

use Bufallus\Models\Order;
use Faker\Generator as Faker;

$factory->define(Order::class, function (Faker $faker) {
    return [
        'table' => $faker->numerify('##'),
        'finalized_at' => $faker->dateTime
    ];
});
