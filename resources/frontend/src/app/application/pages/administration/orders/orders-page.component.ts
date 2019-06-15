import {Component, OnDestroy} from '@angular/core';
import {MatDialog} from '@angular/material';
import {OrderEntity} from '../../../../core/entities/order-entity';
import {OrderService} from '../../../../core/services/order.service';
import {switchMap, take, takeUntil, map, tap} from 'rxjs/operators';
import {
    ConfirmDialogComponent,
    OrderFormDialogComponent,
    OrderItemFormDialogComponent,
    CloseOrderFormDialogComponent
} from '../../../dialogs';
import {ItemService} from '../../../../core/services';
import {ItemEntity} from '../../../../core/entities/item-entity';
import {EMPTY, Subject, interval} from 'rxjs';
import {OrderItemEntity} from '../../../../core/entities/order-item-entity';
import {ToastService} from '../../../../support/services';
import {OrderItemService} from '../../../../core/services/order-item.service';

@Component({
    selector: 'app-orders-page',
    templateUrl: './orders-page.component.html',
    styleUrls: [
        './orders-page.component.less'
    ],
})
export class OrdersPageComponent implements OnDestroy {

    public orders: OrderEntity[] = [];
    public menus: ItemEntity[] = [];
    public loading = false;
    public showFinalized = false;
    public showItemsFinalized: { [key: number]: boolean } = {};
    private destroyed$ = new Subject();
    public lastUpdatedAt = null;
    public filter = {
        interval: [new Date(), new Date()]
    };

    get filteredOrders() {
        return this.orders
            .filter(o => this.showFinalized ? true : !o.is_done);
    }

    public constructor(
        private orderService: OrderService,
        private orderItemService: OrderItemService,
        private itemService: ItemService,
        private toastr: ToastService,
        private dialogService: MatDialog
    ) {
        this.itemService
            .all()
            .pipe(take(1))
            .subscribe(menus => this.menus = menus);

        interval(10000).pipe(
            takeUntil(this.destroyed$),
            map(() => this.refresh())
        ).subscribe();

        this.refresh();
    }

    totalComputedPrice(order: OrderEntity) {
        return order.items.reduce((total, value) => {
            const currValue = value as OrderItemEntity;
            return total += ((currValue.price ? currValue.price : 0) - (currValue.discount ? currValue.discount : 0));
        }, 0);
    }

    toggleFinalized() {
        this.showFinalized = !this.showFinalized;
        this.refresh();
    }

    refresh() {
        const filter = {
            ...this.filter,
            updated_at: this.lastUpdatedAt,
            show_finalized: this.showFinalized
        };

        this.orderService.all(filter).pipe(
            tap(() => this.lastUpdatedAt = new Date()),
            take(1)
        ).subscribe(orders => {
            orders.forEach(order => {
                const local = this.orders.find(o => o.id === order.id);
                if (local) {
                    Object.assign(local, order);
                } else {
                    this.orders.push(order);
                }
            });
        });
    }

    menuById(id: number) {
        return this.menus.find(m => m.id === id);
    }

    orderItems(items: any[], showFinalized: boolean) {
        return items.filter(item => showFinalized ? true : !item.is_done);
    }

    markItemAsDone(order: OrderEntity, item: OrderItemEntity) {
        item.is_done = !item.is_done;
        this.orderItemService.setOrder(order).save(item).subscribe((orderItem) => {
            Object.assign(item, orderItem);
        });
    }

    editItem(item: OrderItemEntity | any, order: OrderEntity, title: string) {
        this.dialogService.open(
            OrderItemFormDialogComponent,
            {
                data: {
                    item: item,
                    title: title,
                    items: this.menus
                },
                panelClass: ['dialog-fullscreen', 'no-padding']
            }
        ).afterClosed().subscribe((updated) => {
            if (updated) {
                this.orderItemService.setOrder(order).save(updated).subscribe((orderItem) => {
                    if (item && item.id) {
                        Object.assign(item, orderItem);
                    } else {
                        order.items.push(orderItem);
                    }
                });
            }
        });
    }

    removeItem(item: OrderItemEntity, order: OrderEntity) {
        this.orderItemService.setOrder(order).delete(item).subscribe(() => {
            order.items = order.items.filter(i => i.id !== item.id);
        });
    }

    edit(order?: OrderEntity | any, title?: string) {
        this.dialogService.open(
            OrderFormDialogComponent,
            {
                data: {
                    order: order,
                    title: title,
                    items: this.menus
                },
                panelClass: 'dialog-fullscreen'
            }
        ).afterClosed().subscribe((data: OrderEntity) => {
            if (data && order) {
                Object.assign(order, {
                    is_done: data.is_done,
                    table: data.table,
                    created_at: data.created_at,
                    finalized_at: data.finalized_at,
                    id: data.id
                });
                order.items = [].concat(data.items);
            } else if (data) {
                this.orders.push(data);
            }
        });
    }

    cancel(order: OrderEntity) {
        this.dialogService.open(
            ConfirmDialogComponent,
            {
                data: {
                    message: 'Tem certeza que deseja cancelar?'
                }
            }
        )
            .afterClosed()
            .pipe(
                switchMap(
                    (confirm) => confirm ? this.orderService.delete(order.id) : EMPTY
                )
            )
            .subscribe((confirm) => {
                if (confirm) {
                    this.orders = this.orders.filter(o => o.id !== order.id);
                    this.toastr.open('Pedido cancelado com sucesso!');
                }
            });
    }

    finalizeOrOpen(order: OrderEntity, done: boolean) {
        if (!done) {
            order.is_done = done;
            this.orderService.save(order).subscribe();
        } else {
            this.dialogService.open(
                CloseOrderFormDialogComponent,
                {
                    data: {
                        order: order,
                        items: this.menus
                    },
                    panelClass: ['dialog-receipt', 'no-border-radius']
                }
            ).afterClosed().subscribe((finalized: OrderEntity) => {
                if (finalized) {
                    Object.assign(order, finalized);
                }
            });
        }
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
