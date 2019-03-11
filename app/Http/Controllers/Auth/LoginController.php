<?php

namespace Bufallus\Http\Controllers\Auth;

use Illuminate\Auth\Events\Attempting;
use Illuminate\Auth\Events\Authenticated;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use League\OAuth2\Server\AuthorizationServer;
use League\OAuth2\Server\Exception\OAuthServerException;
use Psr\Http\Message\ServerRequestInterface;
use Bufallus\Exceptions\AuthException;
use Bufallus\Http\Controllers\Controller;
use Bufallus\Support\Exceptions\ApiException;
use Zend\Diactoros\Response as Psr7Response;
use Bufallus\Models\User;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    /**
     * Handle a login request to the application.
     *
     * @param  ServerRequestInterface $request
     * @return mixed
     *
     * @throws ApiException
     */
    public function login(ServerRequestInterface $request)
    {
        return $this->withErrorHandling(function () use ($request) {
            $httpRequest = request();
            $this->validateLogin($httpRequest);
            $credentials = $this->credentials($httpRequest);

            event(new Attempting($credentials, false));

            $user = (new User())->findForPassport($credentials['username']);

            if (empty($user)) {
                throw AuthException::invalidCredentials();
            }

            $psrResponse = app(AuthorizationServer::class)->respondToAccessTokenRequest(
                $request->withParsedBody($credentials), new Psr7Response
            );

            $response = $this->convertResponse(
                $psrResponse
            );

            if ($response->isSuccessful()) {
                event(new Authenticated($user));

                return [
                    'token' => json_decode($response->content(), true),
                    'user' => $user->toArray()
                ];
            }

            return $response;
        });
    }

    /**
     * Handle a refresh token request to the application.
     *
     * @param  ServerRequestInterface $request
     * @return mixed
     *
     * @throws ApiException
     */
    public function refresh(ServerRequestInterface $request)
    {
        return $this->withErrorHandling(function () use ($request) {
            $httpRequest = request();
            $this->validateRefresh($httpRequest);
            $credentials = array_merge(
                $httpRequest->only('refresh_token'),
                $this->passwordClient(),
                [
                    'grant_type' => 'refresh_token'
                ]
            );
            $psrResponse = app(AuthorizationServer::class)->respondToAccessTokenRequest(
                $request->withParsedBody($credentials), new Psr7Response
            );
            return $this->convertResponse($psrResponse);
        });
    }

    /**
     * Validate the user login request.
     *
     * @param  Request $request
     * @return void
     */
    protected function validateLogin(Request $request)
    {
        $this->validate($request, [
            'email' => 'required|string',
            'password' => 'required|string',
        ]);
    }

    /**
     * @param Request $request
     */
    protected function validateRefresh(Request $request)
    {
        $this->validate($request, [
            'refresh_token' => 'required|string'
        ]);
    }

    /**
     * Get the needed authorization credentials from the request.
     *
     * @param  \Illuminate\Http\Request $request
     * @return array
     */
    protected function credentials(Request $request)
    {
        $data = $request->only('email', 'password');

        return array_merge([
            'username' => $data['email'],
            'password' => $data['password'],
            'grant_type' => 'password'
        ], $this->passwordClient());
    }

    /**
     * @return array
     */
    protected function passwordClient()
    {
        return [
            'client_id' => env('PASSWORD_CLIENT_ID'),
            'client_secret' => env('PASSWORD_CLIENT_SECRET')
        ];
    }

    /**
     * Log the user out of the application.
     *
     * @param  \Illuminate\Http\Request $request
     * @return array
     */
    public function logout(Request $request)
    {
        return [
            'success' => $request->user()->token()->revoke()
        ];
    }

    /**
     * @param \Closure $callback
     * @return mixed
     * @throws ApiException
     */
    private function withErrorHandling(\Closure $callback)
    {
        try {
            return $callback();
        } catch (OAuthServerException $exception) {
            if ($exception->getErrorType() === 'invalid_credentials') {
                throw AuthException::invalidCredentials();
            }

            throw new ApiException(
                'OAuthServerException',
                $exception->getMessage(),
                $exception->getHttpStatusCode(),
                $exception->getPayload()
            );
        }
    }

    /**
     * @param Psr7Response $psrResponse
     * @return Response
     */
    private function convertResponse(Psr7Response $psrResponse)
    {
        return new Response(
            $psrResponse->getBody(),
            $psrResponse->getStatusCode(),
            $psrResponse->getHeaders()
        );
    }
}
