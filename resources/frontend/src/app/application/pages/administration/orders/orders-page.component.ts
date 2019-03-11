import {Component, OnDestroy} from '@angular/core';
import {MatDialog} from '@angular/material';
import {OrderEntity} from '../../../../core/entities/order-entity';
import {OrderService} from '../../../../core/services/order.service';
import {switchMap, take, takeUntil} from 'rxjs/operators';
import {OrderFormDialogComponent} from '../../../dialogs';
import {ItemService} from '../../../../core/services';
import {ItemEntity} from '../../../../core/entities/item-entity';
import {interval, Subject} from 'rxjs';

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
    private destroyed$: Subject = new Subject();

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

        interval(2).pipe(
            takeUntil(this.destroyed$),
            switchMap(() => this.orderService.all())
        ).subscribe(orders => this.orders = orders);
    }

    menuById(id: number) {
        return this.menus.find(m => m.id === id);
    }

    orderItems(items: any[]) {
        return items;
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    markAsDone($event: any, order: OrderEntity) {
        if (order.is_done) {
            order.items.forEach(i => i.is_done = true);
        }
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
        ).afterClosed().subscribe((data) => {
            if (data && order) {
                Object.assign(order, data);
            } else if (data) {
                this.orders.push(data);
            }
        });
    }
}
