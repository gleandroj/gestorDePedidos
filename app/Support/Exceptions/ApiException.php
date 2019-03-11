<?php
/**
 * Created by PhpStorm.
 * User: fabersoft
 * Date: 19/09/18
 * Time: 14:56
 */

namespace Bufallus\Support\Exceptions;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Responsable;

class ApiException extends \Exception implements Arrayable, Responsable
{
    /**
     * @var string
     */
    private $error;

    /**
     * @var int
     */
    private $statusCode;

    /**
     * @var array
     */
    private $extra;

    /**
     * ApiException constructor.
     * @param string $error
     * @param string $message
     * @param int $statusCode
     * @param array $extra
     */
    public function __construct(
        $error = 'unknown',
        $message = 'Oops! something is wrong.',
        $statusCode = 500,
        $extra = []
    )
    {
        $this->error = $error;
        $this->message = $message;
        $this->statusCode = $statusCode;
        $this->extra = $extra;
    }

    /**
     * Get the instance as an array.
     *
     * @return array
     */
    public function toArray()
    {
        return [
            'error' => $this->error,
            'message' => $this->message,
            'data' => $this->extra
        ];
    }

    /**
     * Create an HTTP response that represents the object.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function toResponse($request)
    {
        return response()->json(
            $this->toArray(),
            $this->statusCode
        );
    }
}