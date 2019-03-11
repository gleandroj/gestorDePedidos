<?php

namespace Bufallus\Http\Controllers\Auth;

use Carbon\Carbon;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;
use Bufallus\Http\Requests\RegisterUserRequest;
use Bufallus\Http\Resources\RegisteredUserResource;
use Bufallus\Models\User;
use Bufallus\Http\Controllers\Controller;

class RegisterController extends Controller
{
    /**
     * Handle a registration request for the application.
     *
     * @param  RegisterUserRequest $request
     * @return \Illuminate\Http\Response|mixed
     */
    public function register(RegisterUserRequest $request)
    {
        event(new Registered($user = $this->create($request->validated())));
        return new RegisteredUserResource($user);
    }

    /**
     * @return array
     */
    public function verifyUniqueEmail()
    {
        return [
            'available' => User::isEmailAvailable(
                request('email'),
                request('ignoreId', null)
            )
        ];
    }

    /**
     * @return array
     */
    public function verifyUniqueCellphone()
    {
        return [
            'available' => User::isCellphoneAvailable(
                preg_replace('/[^0-9]/', '', request('cellphone')),
                request('ignoreId', null)
            )
        ];
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array $data
     * @return \Bufallus\Models\User|mixed
     */
    protected function create(array $data)
    {
        $user = User::query()->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
            'gender' => $data['gender'],
            'birthday' => Carbon::createFromFormat('d/m/Y', $data['birthday']),
            'cellphone' => preg_replace('/[^0-9]/', '', $data['cellphone'])
        ]);
        return $user;
    }
}
