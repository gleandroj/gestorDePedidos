import {Component} from '@angular/core';
import {MatDialog} from '@angular/material';
import {OrderEntity} from '../../../../core/entities/order-entity';
import {Observable} from 'rxjs';
import {OrderService} from '../../../../core/services/order.service';
import {map, take} from 'rxjs/operators';
import {OrderFormDialogComponent} from '../../../dialogs';
import {ItemService} from '../../../../core/services';
import {ItemEntity} from '../../../../core/entities/item-entity';

@Component({
    selector: 'app-orders-page',
    templateUrl: './orders-page.component.html',
    styleUrls: [
        './orders-page.component.less'
    ],
})
export class OrdersPageComponent {

    public orders: OrderEntity[] = [];
    public menus: ItemEntity[] = [];
    public loading = false;
    public showFinalized: boolean;

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
    }

    menuById(id: number) {
        return this.menus.find(m => m.id === id);
    }

    orderItems(items: any[]) {
        return items;
    }

    markAsDone($event: any, order: OrderEntity) {
        if (order.is_done) {
            order.items.forEach(i => i.is_done = true);
        }
    }

    edit(order?: OrderEntity, title?: string, event?: Event) {
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
