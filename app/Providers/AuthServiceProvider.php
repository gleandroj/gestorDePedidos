<?php

namespace Bufallus\Providers;

use Carbon\Carbon;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Laravel\Passport\Passport;
use Laravel\Passport\RouteRegistrar;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        'Bufallus\Model' => 'Bufallus\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();
        Passport::personalAccessClientId(2);
        Passport::routes(function (RouteRegistrar $router) {
            //$router->forAccessTokens();
            //$router->forPersonalAccessTokens();
            //$router->forTransientTokens();
        }, ['prefix' => '/api/auth']);
        Passport::tokensExpireIn(Carbon::now()->addMinutes(60));
        Passport::refreshTokensExpireIn(Carbon::now()->addDays(10));
    }
}
