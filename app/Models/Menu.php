<?php

namespace Bufallus\Models;

class Menu extends AbstractModel
{
    protected $fillable = [
        'item'
    ];

    /**
     * @param $perPage
     * @param $orderBy
     * @param $direction
     * @param $filter
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public static function paginate($perPage, $orderBy, $direction, $filter)
    {
        $q = self::query()
            ->orderBy(
                $orderBy,
                $direction
            );

        if ($filter && $filter != null) {
            $q->where(function ($builder) use ($filter) {
                $builder->Orwhere('item', 'ilike', "%${filter}%");
            });
        }

        return $q->paginate(
            $perPage
        );
    }
}
