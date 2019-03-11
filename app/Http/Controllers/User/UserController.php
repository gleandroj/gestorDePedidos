<?php

namespace Bufallus\Http\Controllers\User;

use Illuminate\Support\Carbon;
use Bufallus\Http\Requests\CreateOrUpdateUserRequest;
use Bufallus\Http\Resources\PaginateUserResource;
use Bufallus\Http\Resources\UserResource;
use Bufallus\Models\User;
use Bufallus\Http\Controllers\Controller;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection|\Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        return PaginateUserResource::collection(
            User::paginate(
                request('per_page', 10),
                request('order_by', 'id'),
                request('direction', null),
                array_get(request('filter', []), 'query')
            )
        );
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  CreateOrUpdateUserRequest $request
     * @return \Illuminate\Http\Response|UserResource
     */
    public function store(CreateOrUpdateUserRequest $request)
    {
        $data = $request->validated();
        return new UserResource(
            User::query()->create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => bcrypt($data['password']),
                'gender' => $data['gender'],
                'birthday' => Carbon::createFromFormat('d/m/Y', $data['birthday']),
                'cellphone' => preg_replace('/[^0-9]/', '', $data['cellphone']),
                'role' => $data['role'] ?? null,
            ])
        );
    }

    /**
     * Display the specified resource.
     *
     * @param  \Bufallus\Models\User $user
     * @return UserResource|User
     */
    public function show(User $user)
    {
        return new UserResource($user);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  CreateOrUpdateUserRequest $request
     * @param  \Bufallus\Models\User $user
     * @return \Illuminate\Http\Response|UserResource|User
     */
    public function update(CreateOrUpdateUserRequest $request, User $user)
    {
        $data = $request->validated();
        $update = array_merge(!empty($data['password']) ? [
            'password' => bcrypt($data['password'])
        ] : [], [
            'name' => $data['name'],
            'email' => $data['email'],
            'gender' => $data['gender'],
            'birthday' => Carbon::createFromFormat('d/m/Y', $data['birthday']),
            'cellphone' => preg_replace('/[^0-9]/', '', $data['cellphone']),
            'role' => $data['role'] ?? null,
        ]);
        $user->update($update);
        return new UserResource($user->fresh());
    }
}
