<?php

namespace Bufallus\Exceptions;

use Exception;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Session\TokenMismatchException;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Intervention\Image\Exception\NotFoundException;
use League\OAuth2\Server\Exception\OAuthServerException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Exception\MethodNotAllowedException;
use Bufallus\Support\Exceptions\ApiException;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        ApiException::class,
        OAuthServerException::class
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'password',
        'password_confirmation',
    ];

    /**
     * Report or log an exception.
     *
     * @param  \Exception $exception
     * @return void
     * @throws Exception
     */
    public function report(Exception $exception)
    {
        if (app()->bound('sentry') && $this->shouldReport($exception)) {
            app('sentry')->captureException($exception);
        }
        parent::report($exception);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Exception $exception
     * @return \Illuminate\Http\Response
     */
    public function render($request, Exception $exception)
    {
        $isApiRequest = Str::startsWith($request->getRequestUri(), '/api');

        if ($isApiRequest) {
            return $this->renderApi($request, $exception);
        }

        return parent::render($request, $exception);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param Exception $exception
     * @return \Illuminate\Http\Response
     */
    private function renderApi(\Illuminate\Http\Request $request, Exception $exception)
    {
        if ($exception instanceof ApiException) {
            return $exception->toResponse($request);
        } else if ($exception instanceof AuthenticationException) {
            return (new ApiException(
                'AuthenticationException',
                $exception->getMessage(),
                401
            ))->toResponse($request);
        } else if ($exception instanceof ValidationException) {
            return (new ApiException(
                'ValidationException',
                $exception->getMessage(),
                $exception->status,
                $exception->errors()
            ))->toResponse($request);
        } else if ($exception instanceof ModelNotFoundException) {
            return (new ApiException(
                'ModelNotFoundException',
                $exception->getMessage(),
                404
            ))->toResponse($request);
        } elseif ($exception instanceof AuthorizationException) {
            return (new ApiException(
                'AuthorizationException',
                $exception->getMessage(),
                403
            ))->toResponse($request);
        } elseif ($exception instanceof TokenMismatchException) {
            return (new ApiException(
                'TokenMismatchException',
                $exception->getMessage(),
                419
            ))->toResponse($request);
        } elseif ($exception instanceof MethodNotAllowedException || $exception instanceof MethodNotAllowedHttpException) {
            return (new ApiException(
                'MethodNotAllowedException',
                $exception->getMessage(),
                405
            ))->toResponse($request);
        } elseif ($exception instanceof NotFoundException || $exception instanceof NotFoundHttpException) {
            return (new ApiException(
                'NotFoundException',
                $exception->getMessage(),
                404
            ))->toResponse($request);
        } else if (!config('app.debug')) {
            return (new ApiException(
                'ApiException',
                $exception->getMessage(),
                500
            ))->toResponse($request);
        }

        return parent::render($request, $exception);
    }
}
