import {ChangeDetectorRef, Component, Inject, OnDestroy} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {ToastService} from '../../../support/services';
import {HttpErrorResponse} from '@angular/common/http';
import {OrderEntity} from '../../../core/entities/order-entity';
import {OrderService} from '../../../core/services/order.service';
import {ItemEntity} from '../../../core/entities/item-entity';
import {ItemService} from '../../../core/services';
import {OrderItemEntity} from '../../../core/entities/order-item-entity';
import {Subject} from 'rxjs';

interface DialogOptions {
    order: OrderEntity;
    items: ItemEntity[];
}

@Component({
    selector: 'app-close-order-dialog',
    templateUrl: './close-order-dialog.component.html',
    styleUrls: [
        './close-order-dialog.component.less'
    ],
})
export class CloseOrderFormDialogComponent implements OnDestroy {
    loading = false;
    order: Partial<OrderEntity> = {};
    orderItems: OrderItemEntity[] = [];
    items: ItemEntity[] = [];
    $destroyed = new Subject();

    constructor(
        public orderService: OrderService,
        public itemService: ItemService,
        public dialogRef: MatDialogRef<CloseOrderFormDialogComponent>,
        public toastr: ToastService,
        public changeRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public data: DialogOptions
    ) {
        this.order = Object.assign({
            id: data.order.id,
            table: data.order.table,
            is_done: data.order.is_done
        });
        this.orderItems = data.order.items.slice();
        this.items = data.items;
    }

    orderItemPrice(parent: OrderItemEntity) {
        return parent.children.reduce((total, orderItem: OrderItemEntity) => {
            return total += orderItem.price;
        }, parent.price);
    }

    get totalComputedPrice() {
        return this.orderItems.reduce((total, orderItem) => {
            return total += this.orderItemPrice(orderItem);
        }, 0);
    }

    getItemById(id: number) {
        return this.items.find(m => m.id === id);
    }

    save() {
        this.order.is_done = this.loading = true;
        this.orderService.save(this.order).subscribe((order) => {
            this.loading = false;
            this.toastr.open(
                'Mesa finalizada com sucesso!'
            );
            this.dialogRef.close(order);
        }, (response: HttpErrorResponse) => {
            this.loading = false;
            this.toastr.open(
                'Falha ao finalizar a mesa!'
            );
        });
    }

    cancel() {
        this.dialogRef.close(false);
    }

    ngOnDestroy(): void {
        this.$destroyed.next();
        this.$destroyed.complete();
    }
}
