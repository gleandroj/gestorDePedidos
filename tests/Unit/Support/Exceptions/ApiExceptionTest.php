<?php

namespace Tests\Unit\Support\Exceptions;

use Illuminate\Http\JsonResponse;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Bufallus\Support\Exceptions\ApiException;

class ApiExceptionTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testInstantiate()
    {
        $exception = new ApiException();
        $this->assertInstanceOf(ApiException::class, $exception);
    }

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testToArray()
    {
        $exception = new ApiException();
        $this->assertArrayHasKey('error', $exception->toArray());
        $this->assertArrayHasKey('message', $exception->toArray());
        $this->assertArrayHasKey('data', $exception->toArray());
    }

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testToResponse()
    {
        $exception = new ApiException();
        $this->assertInstanceOf(JsonResponse::class, $exception->toResponse(null));
    }
}
