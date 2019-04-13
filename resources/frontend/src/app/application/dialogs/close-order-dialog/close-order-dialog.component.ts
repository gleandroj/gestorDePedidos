import { ChangeDetectorRef, Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { ToastService } from '../../../support/services';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiException } from '../../../support/interfaces/api-exception';
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
    _loading = false;
    editMode = false;
    title = 'Formulário';
    form: FormGroup;
    order: Partial<OrderEntity>;
    allItems: ItemEntity[] = [];
    filteredOptions: { [key: number]: ItemEntity[] } = {};
    private $destroyed = new Subject();

    get loading() {
        return this._loading;
    }

    set loading(isLoading) {
        if (isLoading) {
            this.form.disable();
        } else {
            this.form.enable();
        }

        this._loading = isLoading;
    }

    constructor(
        public orderService: OrderService,
        public itemService: ItemService,
        public dialogRef: MatDialogRef<CloseOrderFormDialogComponent>,
        public toastr: ToastService,
        public changeRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public data: DialogOptions
    ) {
        this.order = data.order || {};
        this.allItems = data.items || [];
        this.editMode = !!data.order;
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
        this.loading = true;
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
