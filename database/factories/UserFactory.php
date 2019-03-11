<?php

use Faker\Generator as Faker;

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| This directory should contain each of the model factory definitions for
| your application. Factories provide a convenient way to generate new
| model instances for testing / seeding your application's database.
|
*/

$factory->define(Bufallus\Models\User::class, function (Faker $faker) {
    return [
        'name' => $faker->name,
        'email' => $faker->unique()->safeEmail,
        'password' => bcrypt('secret'),
        'remember_token' => str_random(10),
        'birthday' => $faker->date(),
        'cellphone' => $faker->numerify('###########'),
        'type' => $faker->randomElement([
            \Bufallus\Models\User::TYPE_STUDENT,
            \Bufallus\Models\User::TYPE_SERVANT,
            \Bufallus\Models\User::TYPE_COMMUNITY
        ]),
        'registration' => $faker->numerify('#######'),
        'gender' => $faker->randomElement([
            \Bufallus\Models\User::GENDER_MALE,
            \Bufallus\Models\User::GENDER_FEMALE
        ])
    ];
});
