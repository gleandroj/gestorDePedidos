<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Bufallus\Models\User;
use Bufallus\Notifications\User\ResetPasswordNotification;

class AuthenticationApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return mixed
     */
    public function get_valid_token()
    {
        $this->seed(\AuthClientTableSeeder::class);
        $user = factory(User::class)->create(
            [
                'password' => bcrypt($password = 'secret')
            ]
        );
        $response = $this->post('/api/auth/login', [
            'email' => $user->email,
            'password' => $password
        ]);
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'token' => [
                'access_token',
                'refresh_token'
            ],
            'user'
        ]);
        return $response->json('token');
    }

    /**
     * @test
     * @return void
     */
    public function given_a_registered_user_it_should_authenticate_the_user_successfully()
    {
        $this->seed(\AuthClientTableSeeder::class);

        $user = factory(User::class)->create(
            [
                'password' => bcrypt($password = 'secret')
            ]
        );
        $response = $this->post('/api/auth/login', [
            'email' => $user->email,
            'password' => $password
        ]);
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'token' => [
                'access_token',
                'refresh_token'
            ],
            'user'
        ]);

        $response->assertJson([
            'user' => [
                'email' => $user->email
            ]
        ]);
    }

    /**
     * @test
     * @return void
     */
    public function given_a_not_registered_user_it_should_not_authenticate_the_user()
    {
        $this->seed(\AuthClientTableSeeder::class);

        $user = factory(User::class)->make(
            [
                'password' => bcrypt($password = 'secret')
            ]
        );
        $response = $this->post('/api/auth/login', [
            'email' => $user->email,
            'password' => $password
        ]);
        $response->assertStatus(401);
        $response->assertJsonStructure([
            'error',
            'message',
            'data'
        ]);
    }

    /**
     * @test
     * @return void
     */
    public function given_a_valid_access_token_it_should_refresh_the_access_token_successfully()
    {
        $token = $this->get_valid_token();
        $response = $this->post('/api/auth/refresh', [
            'refresh_token' => $token['refresh_token']
        ]);
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'access_token',
            'refresh_token'
        ]);
    }

    /**
     * @test
     */
    public function given_a_revoked_access_token_it_should_not_refresh_the_access_token()
    {
        $token = $this->get_valid_token();
        $tokenHeader = json_decode(base64_decode(substr($token['access_token'], 0, strpos($token['access_token'], '.'))));
        $result = DB::table('oauth_access_tokens')
            ->where('id', $tokenHeader->jti)
            ->update([
                'revoked' => true
            ]);
        $this->assertTrue((bool)$result);
        $response = $this->post('/api/auth/refresh', [
            'refresh_token' => $token['refresh_token']
        ]);
        $response->assertStatus(401);
        $response->assertJsonStructure([
            'error',
            'message',
            'data' => [
                'error',
                'message',
                'hint'
            ]
        ]);
    }

    /**
     * @test
     */
    public function given_a_registered_user_it_should_send_the_recovery_password_mail()
    {
        Notification::fake();
        $user = factory(User::class)->create();
        $response = $this->post('api/auth/password/email', [
            'email' => $user->email
        ]);
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'status'
        ]);

        Notification::assertSentTo(
            $user,
            ResetPasswordNotification::class
        );
    }

    /**
     * @test
     */
    public function given_a_not_registered_user_it_should_not_send_the_recovery_password_mail()
    {
        Notification::fake();
        $user = factory(User::class)->make();
        $response = $this->post('api/auth/password/email', [
            'email' => $user->email
        ]);
        $response->assertStatus(400);
        $response->assertJsonStructure([
            'error',
            'message',
            'data'
        ]);
        Notification::assertNotSentTo(
            $user,
            ResetPasswordNotification::class
        );
    }

    /**
     * @test
     */
    public function given_a_valid_reset_token_it_should_reset_the_user_password()
    {
        Notification::fake();
        $user = factory(User::class)->create();
        $response = $this->post('api/auth/password/email', [
            'email' => $user->email
        ]);
        $response->assertStatus(200);
        $self = $this;
        Notification::assertSentTo(
            $user,
            ResetPasswordNotification::class,
            function ($notification, $channel) use ($user, $self) {
                $response = $self->post('/api/auth/password/email', [
                    'password' => '123321',
                    'password_confirmation' => '123321',
                    'token' => $notification->token,
                    'email' => $user->email
                ]);
                $response->assertStatus(200);
                $response->assertJsonStructure([
                    'success'
                ]);
                return true;
            }
        );
    }

    /**
     * @test
     */
    public function given_a_invalid_reset_token_it_should_not_reset_the_user_password()
    {
        $user = factory(User::class)->create();
        $response = $this->post('api/auth/password/reset', [
            'email' => $user->email,
            'token' => 'invalid_token',
            'password' => '123321',
            'password_confirmation' => '123321'
        ]);
        $response->assertStatus(400);
        $response->assertJsonStructure([
            'error',
            'message',
            'data'
        ]);
    }

    /**
     * @test
     */
    public function given_a_authenticated_user_it_should_logout_successful()
    {
        $token = $this->get_valid_token();
        $token = $token['access_token'];
        $response = $this->post('/api/auth/logout', [], [
            'Authorization' => "Bearer ${token}"
        ]);
        $response->assertStatus(200);
        $response->assertJsonStructure(['success']);
    }

    /**
     * @test
     */
    public function given_a_not_authenticated_user_it_should_not_logout()
    {
        $response = $this->post('/api/auth/logout', [], [
            'Authorization' => "Bearer invalid_token"
        ]);
        $response->assertStatus(401);
        $response->assertJsonStructure(['error', 'message', 'data']);
    }
}
