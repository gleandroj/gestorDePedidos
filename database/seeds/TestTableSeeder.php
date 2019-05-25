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
        factory(Order::class, 2)->create()->each(function (Order $order) {
            factory(OrderItem::class, rand(1, 10))->create([
                'order_id' => $order->getKey()
            ]);
        });
    }
}
