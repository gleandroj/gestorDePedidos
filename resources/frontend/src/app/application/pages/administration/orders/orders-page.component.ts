import {Component, OnDestroy} from '@angular/core';
import {MatDialog} from '@angular/material';
import {OrderEntity} from '../../../../core/entities/order-entity';
import {OrderService} from '../../../../core/services/order.service';
import {switchMap, take, takeUntil} from 'rxjs/operators';
import {OrderFormDialogComponent} from '../../../dialogs';
import {ItemService} from '../../../../core/services';
import {ItemEntity} from '../../../../core/entities/item-entity';
import {interval, Subject} from 'rxjs';
import {OrderItemEntity} from '../../../../core/entities/order-item-entity';

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

    get filteredOrders() {
        return this.orders.filter(o => this.showFinalized ? true : !o.is_done);
    }

    public constructor(
        private orderService: OrderService,
        private menuService: ItemService,
        private dialogService: MatDialog
    ) {
        this.orderService.all()
            .pipe(
                take(1)
            )
            .subscribe(orders => this.orders = orders);
        this.menuService
            .all()
            .pipe(take(1))
            .subscribe(menus => this.menus = menus);

        // interval(10000).pipe(
        //     takeUntil(this.destroyed$),
        //     switchMap(() => this.orderService.all())
        // ).subscribe(orders => this.orders = orders);
    }

    menuById(id: number) {
        return this.menus.find(m => m.id === id);
    }

    orderItems(items: any[], showFinalized: boolean) {
        return items.filter(item => showFinalized ? true : !item.is_done);
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    markAsDone($event: any, order: OrderEntity) {
        if (order.is_done) {
            order.items.forEach(i => i.is_done = true);
        }
        this.orderService.save(order).subscribe();
    }

    markItemAsDone($event, order: OrderEntity, item: OrderItemEntity) {
        item.is_done = !item.is_done;
        this.orderService.save(order).subscribe();
    }

    edit(order?: OrderEntity | any, title?: string, event?: Event) {
        if (event) {
            event.stopPropagation();
        }
        this.dialogService.open(
            OrderFormDialogComponent,
            {
                data: {
                    order: order,
                    title: title
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
}
