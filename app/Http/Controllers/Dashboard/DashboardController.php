<?php
/**
 * Created by PhpStorm.
 * User: fabersoft
 * Date: 10/03/19
 * Time: 19:17
 */

namespace Bufallus\Http\Controllers\Dashboard;

use Bufallus\Http\Controllers\Controller;
use Bufallus\Models\Item;
use Bufallus\Models\Order;
use Bufallus\Models\OrderItem;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Class DashboardController
 * @package Bufallus\Http\Controllers\Dashboard
 */
class DashboardController extends Controller
{
    public function data()
    {
        $interval = $this->parseInterval(request('interval', []));
        $interval[0] = $interval[0] ?? Carbon::now()->startOfDay();
        $interval[1] = $interval[1] ?? Carbon::now()->endOfDay();

        $computed = OrderItem::query()
            ->whereBetween('created_at', $interval)
            ->selectRaw(join(',', [
                'sum(price) as balance',
                'sum(cost) as cost',
                'sum(discount) as discount'
            ]))->first();

        $counts = Order::query()
            ->withTrashed()
            ->whereBetween('created_at', $interval)
            ->selectRaw(join(',', [
                'sum(case when deleted_at is null then 1 else 0 end) as orders',
                'sum(case when deleted_at is not null then 1 else 0 end) as cancelled'
            ]))
            ->first();

        $topFive = OrderItem::query()
            ->with('item')
            ->whereBetween('created_at', $interval)
            ->selectRaw(join(',', [
                'item_id',
                'count(item_id) as count'
            ]))
            ->groupBy([
                'item_id'
            ])
            ->orderByRaw('2 desc')
            ->take(5)
            ->get();

        $groupBy = request('group', 'day');

        $report = OrderItem::query()
            ->whereBetween('created_at', $interval)
            ->selectRaw(join(',', [
                "date_trunc('${groupBy}', created_at) as created_at",
                'sum(case when deleted_at is null then price end) as balance',
                'sum(case when deleted_at is null then cost end) as cost',
                'sum(case when deleted_at is null then discount end) as discount',
                'count(distinct (case when deleted_at is null then order_id end)) as orders',
                'count(distinct (case when deleted_at is not null then order_id end)) as cancelled'
            ]))
            ->groupBy([
                DB::raw('1')
            ])
            ->take(5)
            ->withTrashed()
            ->get();

        $type = $report->count() > 3 ? 'line' : 'column';
        $dayFormat = '%d/%m/%Y';
        $montFormat = '%m/%Y';
        $yearFormat = '%Y';
        $mapToFloat = function ($data) {
            return floatval($data);
        };
        return [
            'top_five' => $topFive->map(function ($itemComputed, $index) {
                return [
                    'position' => $index + 1,
                    'item_id' => $itemComputed->item_id,
                    'count' => $itemComputed->count,
                    'item_description' => $itemComputed->item->description
                ];
            })->all(),
            'orders_count' => $counts['orders'] ?? 0,
            'cancelled_count' => $counts['cancelled'] ?? 0,
            'balance' => $computed['balance'] ?? 0,
            'cost' => $computed['cost'] ?? 0,
            'discount' => $computed['discount'] ?? 0,
            'chart' => [
                'format' => $groupBy === 'day' ? $dayFormat : ($groupBy === 'month' ? $montFormat : $yearFormat),
                'labels' => collect($report->pluck('created_at'))->map(function ($data) {
                    return strtotime($data) * 1000;
                }),
                'series' => [
                    [
                        'name' => 'Pedidos',
                        'type' => $type,
                        'data' => $report->pluck('orders')->map($mapToFloat)
                    ],
                    [
                        'name' => 'Vendas',
                        'type' => $type,
                        'data' => $report->pluck('balance')->map($mapToFloat),
                        'tooltip' => [
                            'valueDecimals' => 2,
                            'valueSuffix' => ' R$'
                        ]
                    ],
                    [
                        'name' => 'Custo',
                        'type' => $type,
                        'data' => $report->pluck('cost')->map($mapToFloat),
                        'tooltip' => [
                            'valueDecimals' => 2,
                            'valueSuffix' => ' R$'
                        ]
                    ],
                    [
                        'name' => 'Descontos',
                        'type' => $type,
                        'data' => $report->pluck('discount')->map($mapToFloat),
                        'tooltip' => [
                            'valueDecimals' => 2,
                            'valueSuffix' => ' R$'
                        ]
                    ],
                    [
                        'name' => 'Cancelados',
                        'type' => $type,
                        'data' => $report->pluck('cancelled')->map($mapToFloat)
                    ]
                ]
            ]
        ];
    }
}
