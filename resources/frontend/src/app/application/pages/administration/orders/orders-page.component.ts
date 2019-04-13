import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { OrderEntity } from '../../../../core/entities/order-entity';
import { OrderService } from '../../../../core/services/order.service';
import { switchMap, take, takeUntil, map } from 'rxjs/operators';
import { ConfirmDialogComponent, OrderFormDialogComponent, OrderItemFormDialogComponent, CloseOrderFormDialogComponent } from '../../../dialogs';
import { ItemService } from '../../../../core/services';
import { ItemEntity } from '../../../../core/entities/item-entity';
import { EMPTY, Subject, interval } from 'rxjs';
import { OrderItemEntity } from '../../../../core/entities/order-item-entity';
import { ToastService } from '../../../../support/services';

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
    public showFinalized: boolean;
    public showItemsFinalized: { [key: number]: boolean } = {};
    private destroyed$ = new Subject();
    public filter = {
        interval: [new Date(), new Date()]
    };

    get filteredOrders() {
        return this.orders
            .filter(o => this.showFinalized ? true : !o.is_done);
    }

    public constructor(
        private orderService: OrderService,
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

    refresh() {
        this.orderService.all(this.filter)
            .pipe(
                take(1)
            )
            .subscribe(orders => {
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
        this.orderService.save(order).subscribe();
    }

    editItem(item: OrderItemEntity, order: OrderEntity, title: string) {
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
            if (updated && updated.id) {
                Object.assign(item, updated);
                this.orderService.save(order).subscribe();
            } else if (updated && !updated.id) {
                order.items = [updated].concat(order.items);
                this.orderService.save(order).subscribe();
            }
        });
    }

    removeItem(item: OrderItemEntity, order: OrderEntity) {
        console.log('remote item');
        console.log(item);
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
                    total_price: data.total_price,
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
                    panelClass: 'dialog-fullscreen'
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
