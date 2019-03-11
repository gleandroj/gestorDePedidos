import {ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastService} from '../../../support/services';
import {HttpErrorResponse} from '@angular/common/http';
import {ApiException} from '../../../support/interfaces/api-exception';
import {OrderEntity} from '../../../core/entities/order-entity';
import {OrderService} from '../../../core/services/order.service';
import {ItemEntity} from '../../../core/entities/item-entity';
import {ItemService} from '../../../core/services';
import {OrderItemEntity} from '../../../core/entities/order-item-entity';
import {distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-order-form-dialog',
    templateUrl: './order-form-dialog.component.html',
    styleUrls: [
        './order-form-dialog.component.less'
    ],
})
export class OrderFormDialogComponent implements OnDestroy {
    _loading = false;
    editMode = false;
    title = 'Formulário';
    form: FormGroup;
    order: OrderEntity;
    allItems: ItemEntity[] = [];
    errors: {
        [key: string]: string[]
    } = {};
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
        public menuService: ItemService,
        public dialogRef: MatDialogRef<OrderFormDialogComponent>,
        public toastr: ToastService,
        public changeRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder
    ) {
        this.title = data.title ? data.title : this.title;
        this.order = data.order ? data.order : {};
        this.editMode = !!data.order;
        this.form = fb.group({
            id: this.order.id,
            table: this.order.table,
            items: fb.array(
                [],
                [Validators.required]
            )
        });
        this.loading = true;
        this.menuService.all().subscribe(items => {
            this.allItems = items;
            if (this.order.items) {
                this.order.items.forEach((i) => this.addItem(i));
            }
            this.loading = false;
        });
    }

    get items() {
        return this.form.get('items') as FormArray;
    }

    get totalComputedPrice() {
        return this.items.value.reduce((total, value) => {
            const currValue = value as OrderItemEntity;
            return total += ((currValue.price ? currValue.price : 0) - (currValue.discount ? currValue.discount : 0));
        }, 0);
    }

    filter(event: any, index: number) {
        const item = event.target.value;
        this.filteredOptions[index] = item ?
            this.allItems.filter(_ => _.description.toLowerCase().indexOf(item) === 0)
            : this.allItems.slice();
    }

    buildItem(item?: OrderItemEntity) {
        return this.fb.group({
            id: [item ? item.id : null],
            quantity: [item ? item.quantity : 1, Validators.required],
            price: [item ? item.price : 0, Validators.required],
            cost: [item ? item.cost : 0, Validators.required],
            discount: [item ? item.discount : 0],
            item_id: [item ? item.item_id : null, Validators.required],
            observation: item ? item.observation : ''
        });
    }

    computePrice(value, itemControl: FormGroup) {
        const itemValue = this.allItems.find(i => i.id === value.item_id);
        if (itemValue) {
            const computedPrice = value.quantity * itemValue.price;
            itemControl.patchValue({
                price: computedPrice,
                cost: value.quantity * itemValue.cost,
                discount: value.discount > computedPrice ? itemValue.price : value.discount,
            }, {onlySelf: false, emitEvent: false});
        } else {
            itemControl.patchValue({
                price: 0,
                cost: 0,
            }, {onlySelf: false, emitEvent: false});
        }
    }

    addItem(item?: OrderItemEntity) {
        const itemControl = this.buildItem(item);
        this.filteredOptions[this.items.length] = this.allItems.slice();
        this.items.insert(0, itemControl);
        itemControl
            .valueChanges
            .pipe(
                takeUntil(this.$destroyed),
                distinctUntilChanged()
            )
            .subscribe((value) => this.computePrice(value, itemControl));
    }

    save() {
        this.loading = true;
        this.orderService.save(this.form.value).subscribe((order) => {
            this.loading = false;
            if (this.form.value.id) {
                this.toastr.open(
                    'Pedido atualizado com sucesso!'
                );
            } else {
                this.toastr.open(
                    'Pedido cadastrado com sucesso!'
                );
            }
            this.dialogRef.close(order);
        }, (response: HttpErrorResponse) => {
            this.loading = false;
            const error = response.error as ApiException<any>;
            if (error.error === 'ValidationException') {
                this.errors = error.data;
                this.form.markAsTouched();
                this.form.markAsDirty();
                this.form.updateValueAndValidity();
            }
        });
    }

    ngOnDestroy(): void {
        this.$destroyed.next();
        this.$destroyed.complete();
    }

    cancel() {
        this.dialogRef.close(false);
    }

    hasError(key: string) {
        return this.errors[key] && this.errors[key].length > 0;
    }

    getError(key: string) {
        return this.hasError(key) ? this.errors[key][0] : '';
    }
}
