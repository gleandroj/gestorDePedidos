<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Bufallus\Support\ValidationRules\Cellphone;

class CellphoneTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testReturnFalseWithInvalidCellphone()
    {
        $this->assertFalse(
            (new Cellphone())->passes('cellphone', '6294372288')
        );
    }

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testReturnTrueWithValidCellphone()
    {
        $this->assertTrue(
            (new Cellphone())->passes('cellphone', '(62) 99437-2288')
        );
    }
}
