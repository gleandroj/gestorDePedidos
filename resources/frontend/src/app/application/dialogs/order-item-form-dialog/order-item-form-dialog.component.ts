import {ChangeDetectorRef, Component, Inject, OnDestroy} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastService} from '../../../support/services';
import {ItemEntity} from '../../../core/entities/item-entity';
import {Subject} from 'rxjs';
import {takeUntil, distinctUntilChanged} from 'rxjs/operators';
import {OrderItemEntity} from '../../../core/entities/order-item-entity';
import {OrderItemService} from '../../../core/services/order-item.service';
import {OrderEntity} from '../../../core/entities/order-entity';
import {HttpErrorResponse} from '@angular/common/http';

interface DialogOptions {
    title?: string;
    items: ItemEntity[];
    order: OrderEntity;
    orderItem?: OrderItemEntity;
    allowObservation?: boolean;
}

@Component({
    selector: 'app-order-item-form-dialog',
    templateUrl: './order-item-form-dialog.component.html',
    styleUrls: [
        './order-item-form-dialog.component.less'
    ],
})
export class OrderItemFormDialogComponent implements OnDestroy {
    _loading = false;
    editMode = false;
    allowObservation: boolean;
    title = 'Formulário';
    form: FormGroup;
    allItems: ItemEntity[] = [];
    orderItem: Partial<OrderItemEntity>;
    order: OrderEntity;
    filteredOptions: ItemEntity[] = [];
    $destroyed = new Subject();

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
        public orderItemService: OrderItemService,
        public dialogRef: MatDialogRef<OrderItemFormDialogComponent>,
        public toastr: ToastService,
        public changeRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public data: DialogOptions,
        fb: FormBuilder
    ) {
        this.orderItem = data.orderItem || {};
        this.order = data.order;
        this.allItems = data.items;
        this.allowObservation = data.allowObservation;
        this.editMode = !!this.orderItem.id;
        this.filteredOptions = this.allItems.slice();

        this.form = fb.group({
            id: [this.orderItem.id || null],
            parent_id: [this.orderItem.parent_id || null],
            quantity: [this.orderItem.quantity || 1, Validators.required],
            price: [this.orderItem.price || 0, Validators.required],
            cost: [this.orderItem.cost || 0, Validators.required],
            discount: [this.orderItem.discount || null],
            item_id: [this.orderItem.item_id || null, Validators.required],
            observation: this.orderItem.observation || null
        });

        this.form.valueChanges.pipe(
            takeUntil(this.$destroyed),
            distinctUntilChanged()
        ).subscribe((value) => this.computePrice(value));
    }

    getItemById(id) {
        return this.allItems.find(i => i.id === id);
    }

    filter(event: any) {
        const item = event.target.value;
        this.filteredOptions = item ?
            this.allItems.filter(_ => _.description.toLowerCase().indexOf(item.toLowerCase()) > -1)
            : this.allItems.slice();
    }

    clear() {
        this.filteredOptions = this.allItems.slice();
    }

    computePrice(value) {
        const itemValue = this.allItems.find(i => i.id === value.item_id);
        if (itemValue) {
            const computedPrice = value.quantity * itemValue.price;
            this.form.patchValue({
                price: computedPrice,
                cost: value.quantity * itemValue.cost,
                discount: value.discount > computedPrice ? itemValue.price : value.discount,
            }, {onlySelf: false, emitEvent: false});
        } else {
            this.form.patchValue({
                price: 0,
                cost: 0,
            }, {onlySelf: false, emitEvent: false});
        }
    }

    ngOnDestroy(): void {
        this.$destroyed.next();
        this.$destroyed.complete();
    }

    cancel() {
        this.dialogRef.close(false);
    }

    save() {
        this.loading = true;
        this.orderItemService.setOrder(this.order).save(this.form.value).subscribe((orderItem) => {
            this.loading = false;
            if (this.form.value.id) {
                this.toastr.open(
                    'Item atualizado com sucesso!'
                );
            } else {
                this.toastr.open(
                    'Item cadastrado com sucesso!'
                );
            }
            this.dialogRef.close(orderItem);
        }, (response: HttpErrorResponse) => {
            this.loading = false;
            if (this.form.value.id) {
                this.toastr.open(
                    'Oops! Falha ao atualizar item.'
                );
            } else {
                this.toastr.open(
                    'Oops! Falha ao cadastrar item.'
                );
            }
        });
    }
}
