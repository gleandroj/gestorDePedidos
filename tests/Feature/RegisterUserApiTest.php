<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Bufallus\Models\User;

class RegisterUserApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @test
     * @return void
     */
    public function it_should_create_a_user()
    {
        $response = $this->post('/api/auth/register', [
            'name' => 'Test User',
            'gender' => 'M',
            'email' => 'test@email.com.br',
            'password' => '123321',
            'password_confirmation' => '123321',
            'birthday' => '29/01/2000',
            'cellphone' => '(62) 99999-9999'
        ]);
        $response->assertStatus(201);
        $response->assertJsonStructure([
            'success',
            'data' => [
                'message'
            ]
        ]);
    }

    /**
     * @test
     * @return void
     */
    public function it_should_not_create_a_user()
    {
        $response = $this->post('/api/auth/register', []);
        $response->assertStatus(422);
        $response->assertJsonStructure([
            'data',
            'error',
            'message'
        ]);
    }

    /**
     * @test
     * @return void
     */
    public function it_should_return_false_when_cellphone_is_taken()
    {
        $user = factory(User::class)->create();
        $response = $this->post('/api/auth/available/cellphone', [
            'cellphone' => $user->cellphone
        ]);
        $response->assertStatus(200);
        $response->assertJson([
            'available' => false
        ]);
    }

    /**
     * @test
     * @return void
     */
    public function it_should_return_true_when_cellphone_is_available()
    {
        $user = factory(User::class)->make();
        $response = $this->post('/api/auth/available/cellphone', [
            'cellphone' => $user->cellphone
        ]);
        $response->assertStatus(200);
        $response->assertJson([
            'available' => true
        ]);
    }

    /**
     * @test
     * @return void
     */
    public function it_should_return_false_when_email_is_taken()
    {
        $user = factory(User::class)->create();
        $response = $this->post('/api/auth/available/email', [
            'email' => $user->email
        ]);
        $response->assertStatus(200);
        $response->assertJson([
            'available' => false
        ]);
    }

    /**
     * @test
     * @return void
     */
    public function it_should_return_true_when_email_is_available()
    {
        $user = factory(User::class)->make();
        $response = $this->post('/api/auth/available/email', [
            'email' => $user->email
        ]);
        $response->assertStatus(200);
        $response->assertJson([
            'available' => true
        ]);
    }
}
