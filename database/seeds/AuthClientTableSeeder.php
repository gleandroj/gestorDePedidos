<?php

use Illuminate\Database\Seeder;

class AuthClientTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \Laravel\Passport\Client::query()->insert([
            'name' => 'App Web Password Client',
            'redirect' => env('APP_URL'),
            'personal_access_client' => false,
            'password_client' => true,
            'revoked' => false,
            'id' => env('PASSWORD_CLIENT_ID'),
            'secret' => env('PASSWORD_CLIENT_SECRET')
        ]);
    }
}
