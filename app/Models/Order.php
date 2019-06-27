<?php

namespace Bufallus\Models;

use Carbon\Carbon;

use Mike42\Escpos\CapabilityProfile;
use Mike42\Escpos\EscposImage;
use Mike42\Escpos\PrintConnectors\CupsPrintConnector;
use Mike42\Escpos\Printer;

class Order extends AbstractModel
{
    protected $fillable = [
        'table',
        'finalized_at'
    ];

    protected $casts = [];

    protected $dates = [
        'finalized_at',
        'created_at',
        'updated_at'
    ];

    /**
     * @param array $interval
     * @param null $lastUpdated
     * @param bool $showFinalized
     * @return \Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Query\Builder[]|\Illuminate\Support\Collection
     */
    public static function orders(array $interval = [], $lastUpdated = null, $showFinalized = false)
    {
        $interval = $interval ?? [Carbon::now()->startOfDay(), Carbon::now()->endOfDay()];
        $q = static::query()
            ->whereBetween('created_at', $interval)
            ->orderBy('created_at', 'asc');

        if (!empty($lastUpdated) && !$showFinalized) {
            $q->where('updated_at', '>=', Carbon::parse($lastUpdated)->setTimezone(config('app.timezone')));
        }

        return $q->orderBy('created_at', 'asc')->get();
    }

    /**
     * @param bool $onlyParents
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function orderItems($onlyParents = false)
    {
        $q = $this->hasMany(OrderItem::class)->orderBy('created_at', 'asc');

        if ($onlyParents) {
            $q->whereNull('parent_id');
        }

        return $q;
    }

    /**
     * @param array $itemsAllowed
     * @throws \Exception
     */
    public function print($itemsAllowed = [])
    {
        $maxChar = 32;
        /** @var Carbon $createdAt */
        $createdAt = $this->created_at;
        $createdAt = $createdAt->format('d/m/Y H:i:s');

        $connector = new CupsPrintConnector("printer");
        $profile = CapabilityProfile::load("default");
        $printer = new Printer($connector, $profile);

        $tux = EscposImage::load(base_path("resources/frontend/src/assets/img/logo-print.png"), true);

        $printer->bitImage($tux);

        $printer->setJustification(Printer::JUSTIFY_CENTER);
        $printer->selectPrintMode(Printer::MODE_EMPHASIZED);
        $printer->text("Mesa: {$this->table}\n");
        $printer->selectPrintMode();
        $printer->setJustification(Printer::JUSTIFY_LEFT);
        $printer->feed();

        $printOrderItem = function (OrderItem $orderItem, Printer $printer, $subItem = false) use ($maxChar) {
            $item = $orderItem->item->description;

            $qty = str_pad($orderItem->quantity . 'x', 3, ' ', STR_PAD_RIGHT);
            $obs = substr($orderItem->observation, 0, $maxChar);
            $qty = $subItem ? ' - ' . $qty : $qty;

            $printer->setFont(Printer::FONT_A);
            $printer->text("${qty}  ${item}\n");

            if (!$subItem && !empty($obs)) {
                $printer->text("Obs: ${obs}\n");
            }
        };

        $this->orderItems()->whereIn('id', $itemsAllowed)->whereNull('parent_id')->get()
            ->each(function (OrderItem $orderItem) use ($printOrderItem, $printer, $maxChar, $itemsAllowed) {
                $printOrderItem($orderItem, $printer);
                $orderItem->children()->whereIn('id', $itemsAllowed)->whereNotNull('parent_id')
                    ->each(function (OrderItem $orderItem) use ($printOrderItem, $printer) {
                        $printOrderItem($orderItem, $printer, true);
                    });
                $printer->selectPrintMode(Printer::MODE_EMPHASIZED);
                $printer->text(str_pad('', $maxChar, '-'));
                $printer->selectPrintMode();
            });

        $printer->feed();
        $printer->text("Abertura: {$createdAt}\n");
        $printer->feed(2);
        $printer->cut();
        $printer->close();
    }
}
