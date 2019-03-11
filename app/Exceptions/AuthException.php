<?php
/**
 * Created by PhpStorm.
 * User: fabersoft
 * Date: 25/09/18
 * Time: 14:57
 */

namespace Bufallus\Exceptions;

use Illuminate\Auth\Access\AuthorizationException;
use Bufallus\Support\Exceptions\ApiException;

class AuthException extends ApiException
{
    public static function invalidCredentials()
    {
        return new static('AuthException', trans('auth.failed'), 401);
    }

    public static function unauthorized()
    {
        throw new AuthorizationException(trans('auth.unauthorized'));
    }
}