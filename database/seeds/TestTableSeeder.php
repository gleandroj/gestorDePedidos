<?php

use Bufallus\Models\Order;
use Bufallus\Models\OrderItem;
use Illuminate\Database\Seeder;

class TestTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        for ($i = 0; $i < 10; $i++) {
            $order = factory(Order::class)->create([
                'created_at' => \Carbon\Carbon::now()->subDay($i),
                'updated_at' => \Carbon\Carbon::now()->subDay($i)
            ]);
            factory(OrderItem::class, rand(1, 2))->create([
                'order_id' => $order->getKey(),
                'created_at' => \Carbon\Carbon::now()->subDay($i),
                'updated_at' => \Carbon\Carbon::now()->subDay($i)
            ])->each(function (OrderItem $orderItem) {
                factory(OrderItem::class, rand(1, 2))->create([
                    'order_id' => $orderItem->order_id,
                    'parent_id' => $orderItem->getKey()
                ]);
            });
        }
    }
}
