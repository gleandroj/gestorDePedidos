import {Component, Input} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ItemEntity} from '../../../core/entities/item-entity';
import {map} from 'rxjs/operators';
import {OrderEntity} from '../../../core/entities/order-entity';
import {OrderItemEntity} from '../../../core/entities/order-item-entity';
import {OrderItemFormDialogComponent} from '../../dialogs';
import {OrderService} from '../../../core/services/order.service';
import {OrderItemService} from '../../../core/services/order-item.service';
import {ItemService} from '../../../core/services';
import {ToastService} from '../../../support/services';
import {MatDialog} from '@angular/material';

@Component({
    selector: 'app-table-items',
    templateUrl: './table-items.component.html',
    styleUrls: [
        './table-items.component.less'
    ],
})
export class TableItemsComponent {

    @Input() order: OrderEntity;
    @Input() public items: ItemEntity[] = [];
    public showFinalized = false;
    public selecting = false;
    public selected = [];

    get orderItems() {
        return this.order.items.filter(item => this.showFinalized ? true : !!!item.finalized_at);
    }

    constructor(
        private orderService: OrderService,
        private orderItemService: OrderItemService,
        private itemService: ItemService,
        private toastr: ToastService,
        private dialogService: MatDialog
    ) {
    }

    print() {
        this.orderService.print(this.order, this.selected).subscribe(() => {
            this.toastr.open('Impressão finalizada!');
        }, () => {
            this.toastr.open('Oops! Falha ao realizar impressão.');
        });
    }

    orderItemPrice(parent: OrderItemEntity) {
        return parent.children.reduce((total, orderItem: OrderItemEntity) => {
            return total += orderItem.price;
        }, parent.price);
    }

    menuById(id: number) {
        return this.items.find(m => m.id === id);
    }

    isSelected(orderItem: OrderItemEntity) {
        return this.selected.indexOf(orderItem) > -1;
    }

    select(orderItem: OrderItemEntity) {
        this.selected.push(orderItem);
        if (orderItem.children) {
            orderItem.children.forEach(child => this.selected.push(child));
        }
    }

    unselect(orderItem: OrderItemEntity) {
        this.selected.splice(this.selected.indexOf(orderItem), 1);
        if (orderItem.children) {
            orderItem.children.forEach(child => this.selected.splice(this.selected.indexOf(child), 1));
        }
    }

    toggleSelect(orderItem: OrderItemEntity, event: Event | any) {
        if (!!false) {
            console.log('Select function disabled');
            return;
        }

        if (event && event.type === 'press') {
            this.selecting = true;
        }

        if (this.selecting && this.isSelected(orderItem)) {
            this.unselect(orderItem);
        } else if (this.selecting) {
            this.select(orderItem);
        }

        if (this.selected.length === 0) {
            this.selecting = false;
        }
    }

    markItemAsDone(item: OrderItemEntity) {
        this.orderItemService.setOrder(this.order).save({
            ...item,
            is_done: !!!item.finalized_at
        }).subscribe((orderItem) => {
            Object.assign(item, orderItem);
        });
    }

    editItem(item: Partial<OrderItemEntity>, title: string, event?: Event, parent?: OrderItemEntity) {
        if (event && event.target &&
            (event.target['tagName'] === 'MAT-ICON' || event.target['tagName'] === 'BUTTON')
        ) {
            return;
        }

        this.dialogService.open(
            OrderItemFormDialogComponent,
            {
                data: {
                    order: this.order,
                    orderItem: {
                        ...item,
                        parent_id: parent && parent.id
                    },
                    title: title,
                    items: this.items,
                    allowObservation: !!!parent
                },
                panelClass: ['dialog-fullscreen', 'no-padding'],
                disableClose: true
            }
        ).afterClosed().subscribe((newItem) => {
            if (newItem && item.id) {
                Object.assign(item, newItem);
            } else if (newItem && parent) {
                parent.children.push(newItem);
            } else if (newItem) {
                this.order.items.push(newItem);
            }
        });
    }

    removeItem(item: OrderItemEntity, parent?: OrderItemEntity) {
        this.orderItemService.setOrder(this.order).delete(item).subscribe(() => {
            if (parent) {
                parent.children = parent.children.filter(i => i.id !== item.id);
            } else {
                this.order.items = this.order.items.filter(i => i.id !== item.id);
            }
        });
    }
}
