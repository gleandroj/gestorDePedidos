<?php

namespace Bufallus\Models;

class Item extends AbstractModel
{
    protected $fillable = [
        'description',
        'price',
        'cost'
    ];

    protected $casts = [
        'price' => 'double',
        'cost' => 'double'
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
                $builder->Orwhere('description', 'ilike', "%${filter}%");
            });
        }

        return $q->paginate(
            $perPage
        );
    }
}
