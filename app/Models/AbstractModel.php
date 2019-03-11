<?php
/**
 * Created by PhpStorm.
 * User: fabersoft
 * Date: 29/10/18
 * Time: 17:46
 */

namespace Bufallus\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AbstractModel extends Model
{
    use SoftDeletes;

    CONST DATE_FORMAT = 'Y-m-d H:i:s';
    protected $dateFormat = self::DATE_FORMAT;

    /**
     * @param \Illuminate\Database\Eloquent\Builder|\Illuminate\Database\Eloquent\Builder $query
     * @param $as
     * @return \Illuminate\Database\Query\Builder
     */
    protected static function makeSubSelectAs($query, $as)
    {
        return $query->getConnection()->table(
            $query->getConnection()->raw("({$query->toSql()}) as ${as}")
        )->mergeBindings($query->getQuery());
    }
}
