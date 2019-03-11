<?php

namespace Tests\Unit\Models;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Bufallus\Models\User;

class UserTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testCreateUser()
    {
        $user = factory(User::class)->make();
        $this->assertTrue($user->save());
        $this->assertNotEmpty($user->id);
    }

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testUpdateUser()
    {
        $user = factory(User::class)->create();
        $this->assertTrue($user->update([
            'name' => 'Test Updated'
        ]));
    }

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testFindUser()
    {
        $user = factory(User::class)->create();
        $found = User::query()->find($user->id);
        $this->assertNotEmpty($found);
        $this->assertEquals($user->id, $found->id);
    }

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testDeleteUser()
    {
        $user = factory(User::class)->create();
        $this->assertTrue($user->delete());
        $this->assertEmpty(User::query()->find($user->id));
    }

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testEmailAvailable()
    {
        $user = factory(User::class)->make();
        $this->assertTrue(User::isEmailAvailable($user->email));
    }

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testCellphoneAvailable()
    {
        $user = factory(User::class)->make();
        $this->assertTrue(User::isCellphoneAvailable($user->cellphone));
    }

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testEmailNotAvailable()
    {
        $user = factory(User::class)->create();
        $this->assertFalse(User::isEmailAvailable($user->email));
    }

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testCellphoneNotAvailable()
    {
        $user = factory(User::class)->create();
        $this->assertFalse(User::isCellphoneAvailable($user->cellphone));
    }

    /**
     *
     */
    public function testFindForPassport()
    {
        $user = factory(User::class)->create();
        $this->assertNotNull($user);
        $forPassport = (new User())->findForPassport($user->email);
        $this->assertEquals($user->id, $forPassport->id);
    }
}
