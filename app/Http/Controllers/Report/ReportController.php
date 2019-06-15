<?php
/**
 * Created by PhpStorm.
 * User: fabersoft
 * Date: 10/03/19
 * Time: 19:17
 */

namespace Bufallus\Http\Controllers\Report;

use Bufallus\Http\Controllers\Controller;
use Bufallus\Http\Resources\ReportItemResource;
use Bufallus\Models\OrderItem;
use Illuminate\Support\Carbon;

/**
 * Class ReportController
 * @package Bufallus\Http\Controllers\Report
 */
class ReportController extends Controller
{
    public function paginate()
    {
        $perPage = request('per_page', 10);
        $oderBy = request('order_by', 'item_id');
        $dir = request('direction', null);
        $filter = request('filter', []);
        $query = array_get($filter, 'query');

        $interval = $this->parseInterval(array_get($filter, 'interval'));
        $interval[0] = $interval[0] ?? Carbon::now()->startOfMonth();
        $interval[1] = $interval[1] ?? Carbon::now()->endOfMonth();

        $q = OrderItem::query()
            ->join('items', 'order_items.item_id', '=', 'items.id')
            ->selectRaw(join(',', [
                'order_items.item_id as item_id',
                'items.description as description',
                'sum(order_items.quantity) as quantity',
                'sum(order_items.price) as price',
                'sum(order_items.cost) as cost',
                'sum(order_items.discount) as discount'
            ]))
            ->groupBy([
                'item_id',
                'items.description'
            ])
            ->whereBetween('order_items.created_at', $interval)
            ->orderBy($oderBy, $dir);

        if ($query) {
            $q->where('items.description', 'ilike', "%$query%");
        }

        return ReportItemResource::collection($q->paginate($perPage))->additional([
            'interval' => $interval
        ]);
    }
}
