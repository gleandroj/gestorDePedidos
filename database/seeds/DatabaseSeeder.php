<?php

use Illuminate\Database\Seeder;
use Faker\Generator as Faker;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        \Bufallus\Models\User::query()->create([
            'name' => 'Administrator',
            'email' => 'admin@bufallus.com.br',
            'password' => bcrypt('secret'),
            'cellphone' => '62999999999',
            'birthday' => '2018-09-25',
            'gender' => \Bufallus\Models\User::GENDER_MALE,
            'role' => \Bufallus\Models\User::ROLE_ADMIN
        ]);

        $this->call(AuthClientTableSeeder::class);
        if (env('APP_ENV') != 'production') {
            $this->testSeed();
        }
    }

    private function testSeed()
    {}
}
