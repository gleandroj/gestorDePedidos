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
        $q = $this->orderItems()
            ->whereNull('parent_id')
            ->whereNull('finalized_at');

        if (count($itemsAllowed) > 0) {
            $q = $q->orWhere(function ($q) use ($itemsAllowed) {
                $q->orWhereIn('id', $itemsAllowed)
                    ->whereNull('parent_id');
            });
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
        $maxChar = 32;
        $font = Printer::FONT_A;
        $orderItems = $this->orderItemsToPrint($itemsAllowed);

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
            $printOrderItem = function (OrderItem $orderItem, Printer $printer, $subItem = false) use ($maxChar) {
                $item = $orderItem->item->description;
                $qtyChar = 3;
                $priceChar = 5;

                $qty = str_pad($orderItem->quantity . 'x', $qtyChar, ' ', STR_PAD_RIGHT);

                $obs = substr($orderItem->observation, 0, $maxChar);

                $qty = $subItem ? '' . $qty : $qty;

                $price = number_format($orderItem->price, 2, ',', '.');
                $price = '';// str_pad($price, $priceChar, '.', STR_PAD_LEFT) . 'R$';

                $itemLine = "${qty}   ${item}";

                $padLen = $maxChar - strlen($itemLine) - 1;

                $itemLine = $itemLine . str_pad($price, $padLen, ' ', STR_PAD_LEFT);

                $printer->text("${itemLine}\n");

                if (!$subItem && !empty($obs)) {
                    $printer->text("Obs: ${obs}\n");
                }
            };

            $orderItems->each(function (OrderItem $orderItem) use ($printOrderItem, $printer, $maxChar, $itemsAllowed) {
                $printOrderItem($orderItem, $printer);
                $orderItem->childrenToPrint($itemsAllowed)->each(function (OrderItem $orderItem) use ($printOrderItem, $printer) {
                    $printOrderItem($orderItem, $printer, true);
                });
                $printer->text(str_pad('', $maxChar, '.'));
            });

            $printer->feed();
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
