import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {MatDialog} from '@angular/material';
import {OrderEntity} from '../../../core/entities/order-entity';
import {OrderService} from '../../../core/services/order.service';
import {ItemService} from '../../../core/services';
import {ToastService} from '../../../support/services';
import {OrderItemService} from '../../../core/services/order-item.service';
import {ItemEntity} from '../../../core/entities/item-entity';
import {EMPTY, interval, of, Subject} from 'rxjs';
import {OrderItemEntity} from '../../../core/entities/order-item-entity';
import {map, switchMap, take, takeUntil, tap} from 'rxjs/operators';
import {CloseOrderFormDialogComponent, ConfirmDialogComponent, OrderFormDialogComponent, OrderItemFormDialogComponent} from '../../dialogs';
import {ActivatedRoute} from '@angular/router';
import * as moment from 'moment';

@Component({
    selector: 'app-tables',
    templateUrl: './tables.component.html',
    styleUrls: [
        './tables.component.less'
    ],
})
export class TablesComponent implements OnDestroy, OnInit, OnChanges {

    private destroyed$ = new Subject();
    public loading = false;
    public lastUpdatedAt = null;

    @Input()
    public filter = {};
    @Input()
    public showFinalized = false;

    public orders: OrderEntity[] = [];
    public menus: ItemEntity[] = [];
    public showItemsFinalized: { [key: number]: boolean } = {};

    get filteredOrders() {
        return this.orders
            .filter(o => this.showFinalized ? true : !o.finalized_at);
    }

    public constructor(
        private orderService: OrderService,
        private orderItemService: OrderItemService,
        private itemService: ItemService,
        private toastr: ToastService,
        private dialogService: MatDialog,
        private activatedRoute: ActivatedRoute
    ) {
        this.menus = this.activatedRoute.snapshot.data['menus'];
    }

    ngOnInit(): void {
        interval(10000).pipe(
            takeUntil(this.destroyed$),
            map(() => this.refresh())
        ).subscribe();

        this.refresh(true);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['filter'] && !changes['filter'].isFirstChange()) {
            this.refresh(true);
        }
    }

    duration(createdAt: string, finalizedAt?: string) {
        const now = finalizedAt ? moment(finalizedAt) : moment();
        const duration = moment.duration(now.diff(moment(createdAt)));
        return moment.utc(duration.asMilliseconds()).format('HH\\h mm\\m');
    }

    refresh(first?: boolean) {
        const filter = {
            ...this.filter,
            updated_at: this.lastUpdatedAt
        };
        this.loading = first;
        this.orderService.all(filter).pipe(
            tap(() => this.lastUpdatedAt = new Date()),
            take(1)
        ).subscribe(orders => {
            this.loading = false;
            orders.forEach(order => {
                const local = this.orders.find(o => o.id === order.id);
                if (local) {
                    Object.assign(local, order);
                } else {
                    this.orders.push(order);
                }
            });
        }, () => {
            this.loading = false;
        });
    }

    menuById(id: number) {
        return this.menus.find(m => m.id === id);
    }

    orderItemPrice(parent: OrderItemEntity) {
        return parent.children.reduce((total, orderItem: OrderItemEntity) => {
            return total += orderItem.price;
        }, parent.price);
    }

    orderPrice(order: OrderEntity) {
        return order.items.reduce((total, orderItem: OrderItemEntity) => {
            return total += this.orderItemPrice(orderItem);
        }, 0);
    }

    edit(order?: Partial<OrderEntity>, title?: string) {
        this.dialogService.open(
            OrderFormDialogComponent,
            {
                data: {
                    order: order,
                    title: title
                }
            }
        ).afterClosed().subscribe((newOrder: OrderEntity) => {
            if (newOrder && order.id) {
                Object.assign(order, newOrder);
            } else if (newOrder) {
                this.orders.push(newOrder);
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
        ).afterClosed().pipe(
            switchMap(
                (confirm) => confirm ? this.orderService.delete(order.id) : EMPTY
            )
        ).subscribe((confirm) => {
            if (confirm) {
                this.orders = this.orders.filter(o => o.id !== order.id);
                this.toastr.open('Mesa cancelada com sucesso!');
            }
        });
    }

    finalizeOrOpen(order: OrderEntity, done: boolean) {
        if (!done) {
            this.orderService.save({
                ...order,
                is_done: done
            }).subscribe((opened) => {
                order.finalized_at = opened.finalized_at;
                order.items = opened.items;
            });
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
                    order.finalized_at = finalized.finalized_at;
                    order.items = finalized.items;
                }
            });
        }
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
