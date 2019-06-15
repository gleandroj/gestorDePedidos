import {ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastService} from '../../../support/services';
import {OrderService} from '../../../core/services/order.service';
import {ItemEntity} from '../../../core/entities/item-entity';
import {ItemService} from '../../../core/services';
import {Subject} from 'rxjs';
import {takeUntil, distinctUntilChanged} from 'rxjs/operators';
import {OrderItemEntity} from '../../../core/entities/order-item-entity';

interface DialogOptions {
    title?: string;
    item?: OrderItemEntity;
    items?: ItemEntity[];
}

@Component({
    selector: 'app-order-item-form-dialog',
    templateUrl: './order-item-form-dialog.component.html',
    styleUrls: [
        './order-item-form-dialog.component.less'
    ],
})
export class OrderItemFormDialogComponent implements OnDestroy {
    editMode = false;
    title = 'Formulário';
    form: FormGroup;
    allItems: ItemEntity[] = [];
    item: Partial<OrderItemEntity>;
    filteredOptions: ItemEntity[] = [];
    $destroyed = new Subject();

    constructor(
        public orderService: OrderService,
        public itemService: ItemService,
        public dialogRef: MatDialogRef<OrderItemFormDialogComponent>,
        public toastr: ToastService,
        public changeRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public data: DialogOptions,
        fb: FormBuilder
    ) {
        this.editMode = !!(data.item && data.item.id);
        this.item = data.item || {};
        this.allItems = data.items || [];
        this.filteredOptions = this.allItems.slice();
        this.form = fb.group({
            id: [this.item.id || null],
            quantity: [this.item.quantity || 1, Validators.required],
            price: [this.item.price || 0, Validators.required],
            cost: [this.item.cost || 0, Validators.required],
            discount: [this.item.discount || null],
            item_id: [this.item.item_id || null, Validators.required],
            observation: this.item.observation || null
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
        this.dialogRef.close(this.form.value);
    }
}
