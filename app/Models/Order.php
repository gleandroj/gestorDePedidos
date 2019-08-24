<?php

namespace Bufallus\Models;

use Bufallus\Support\Exceptions\ApiException;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
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
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function orderItemsToPrint($itemsAllowed = [])
    {
        $q = $this->orderItems()->whereNull('finalized_at');

        if (count($itemsAllowed) > 0) {
            $q->whereIn('id', $itemsAllowed);
        }

        return $q->get();
    }

    /**
     * @param array $itemsAllowed
     * @throws \Exception
     */
    public function print($itemsAllowed = [])
    {
        //A 32 B 44
        //2 espaços + 2 do R$
        $withPrice = false;
        $maxChar = 32;
        $qtyChar = 4;
        $priceChar = 8;
        $maxItemChar = 16;
        $maxItemChar = $withPrice ? $maxItemChar : $maxItemChar + $priceChar + 3;

        $font = Printer::FONT_A;

        $orderItems = $this->orderItemsToPrint($itemsAllowed);

        $total = $orderItems->reduce(function ($total, OrderItem $orderItem) {
            return $total += $orderItem->price - $orderItem->discount;
        }, 0);

        $total = number_format($total, 2, ',', '.');
        $total = str_pad($total, ($maxChar - 9), ' ', STR_PAD_LEFT) . 'R$';

        if ($orderItems->count() === 0) {
            throw new ApiException('empty_table', 'Nenhum item selecionado ou cadastrado na mesa.', 400);
        }

        try {
            /** @var Carbon $createdAt */
            $createdAt = $this->created_at;
            $createdAt = $createdAt->format('d/m/Y H:i:s');
            $table = $this->attributes['table'];

            $connector = new CupsPrintConnector("printer");
            $profile = CapabilityProfile::load("POS-5890");
            $printer = new Printer($connector, $profile);

            $tux = EscposImage::load(base_path("resources/frontend/src/assets/img/logo-print.png"), true);
            $printer->bitImage($tux);

            /** Title */
            $printer->setJustification(Printer::JUSTIFY_CENTER);
            $printer->selectPrintMode(Printer::MODE_EMPHASIZED);
            $printer->text("Mesa: {$table}\n");
            $printer->feed();

            /** Config */
            $printer->selectPrintMode();
            $printer->setFont($font);
            $printer->setJustification(Printer::JUSTIFY_LEFT);

            /** Items */
            $printOrderItem = function (OrderItem $orderItem, Printer $printer, $subItem = false) use ($withPrice, $maxItemChar, $maxChar, $qtyChar, $priceChar) {
                $item = substr($orderItem->item->description, 0, $maxItemChar);

                $qty = str_pad($orderItem->quantity . 'x', $qtyChar, ' ', STR_PAD_RIGHT);

                $obs = substr($orderItem->observation, 0, $maxChar);

                if ($withPrice) {
                    $price = number_format($orderItem->price, 2, ',', '.');
                    $price = str_pad($price, $priceChar, ' ', STR_PAD_LEFT) . 'R$';
                } else {
                    $price = '';
                }

                $itemLine = "${qty} ${item}";

                $padLen = $maxChar - strlen($itemLine) - 1;

                $itemLine = $itemLine . ($withPrice ? ' ' : '') . str_pad($price, $padLen, ' ', STR_PAD_LEFT);

                $printer->text("${itemLine}\n");

                if (!$subItem && !empty($obs)) {
                    $printer->text("Obs:  ${obs}\n");
                }
            };

            $printered = [];

            $orderItems->filter(function($orderItem){
                return empty($orderItem->parent_id);
            })->each(function (OrderItem $orderItem) use ($printOrderItem, &$printered, $orderItems, $printer, $maxChar) {
                $printered[] = $orderItem->id;

                $printOrderItem($orderItem, $printer);

                $orderItems->each(function($subItem) use($printOrderItem, &$printered, $printer, $orderItem){
                    if($subItem->parent_id == $orderItem->id){
                        $printered[] = $subItem->id;
                        $printOrderItem($subItem, $printer, true);
                    }
                });

                $createdAt = $orderItem->created_at->format('d/m/Y H:i:s');
                $createdAt = str_pad($createdAt, $maxChar - 6, ' ', STR_PAD_LEFT);
                $printer->feed();
                $printer->text("Hora: {$createdAt}\n");
                $printer->text(str_pad('', $maxChar, '.'));
            });

            $orderItems->whereNotIn('id', $printered)->each(function($orderItem) use($printOrderItem, &$printered, $orderItems, $printer, $maxChar){
                $printOrderItem($orderItem, $printer);
                $createdAt = $orderItem->created_at->format('d/m/Y H:i:s');
                $createdAt = str_pad($createdAt, $maxChar - 6, ' ', STR_PAD_LEFT);
                $printer->feed();
                $printer->text("Hora: {$createdAt}\n");
                $printer->text(str_pad('', $maxChar, '.'));
            });

            $printer->feed();
            if ($withPrice) {
                $printer->text("Total: {$total}\n");
            }
            $printer->text("Abertura: {$createdAt}\n");
            $printer->feed(2);
            $printer->cut();
            $printer->close();
        } catch (\Exception $exception) {
            Log::error($exception->getMessage(), ['exception' => $exception]);
            throw new ApiException('exception', 'Oops! Falha ao realizar impressão.', 400, [
                'details' => $exception->getMessage()
            ]);
        }
    }
}
