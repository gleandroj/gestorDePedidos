import { ChangeDetectorRef, Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastService } from '../../../support/services';
import { HttpErrorResponse } from '@angular/common/http';
import { OrderEntity } from '../../../core/entities/order-entity';
import { OrderService } from '../../../core/services/order.service';
import { ItemEntity } from '../../../core/entities/item-entity';
import { ItemService } from '../../../core/services';
import { OrderItemEntity } from '../../../core/entities/order-item-entity';
import { Subject } from 'rxjs';

interface DialogOptions {
    order?: OrderEntity;
    items?: ItemEntity[];
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
    order: Partial<OrderEntity>;
    allItems: ItemEntity[] = [];
    $destroyed = new Subject();

    constructor(
        public orderService: OrderService,
        public itemService: ItemService,
        public dialogRef: MatDialogRef<CloseOrderFormDialogComponent>,
        public toastr: ToastService,
        public changeRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public data: DialogOptions
    ) {
        this.order = data.order ? Object.assign({}, data.order) : {};
        this.allItems = data.items || [];
    }

    get items() {
        return this.order.items;
    }

    get totalComputedPrice() {
        return this.items.reduce((total, value) => {
            const currValue = value as OrderItemEntity;
            return total += ((currValue.price ? currValue.price : 0) - (currValue.discount ? currValue.discount : 0));
        }, 0);
    }

    getItemById(id) {
        return this.allItems.find(i => i.id === id);
    }

    save() {
        this.order.is_done = this.loading = true;
        this.order.items.forEach(i => i.is_done = true);

        this.orderService.save(this.order).subscribe((order) => {
            this.loading = false;
            this.toastr.open(
                'Pedido finalizado com sucesso!'
            );
            this.dialogRef.close(order);
        }, (response: HttpErrorResponse) => {
            this.loading = false;
            this.toastr.open(
                'Falha ao finalizar o pedido!'
            );
        });
    }

    ngOnDestroy(): void {
        this.$destroyed.next();
        this.$destroyed.complete();
    }

    cancel() {
        this.dialogRef.close(false);
    }
}
