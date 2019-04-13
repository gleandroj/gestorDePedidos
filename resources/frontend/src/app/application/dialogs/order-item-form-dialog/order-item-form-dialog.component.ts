import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../../support/services';
import { OrderService } from '../../../core/services/order.service';
import { ItemEntity } from '../../../core/entities/item-entity';
import { ItemService } from '../../../core/services';
import { Subject } from 'rxjs';
import { takeUntil, distinctUntilChanged } from 'rxjs/operators';

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
    title = 'Formulário';
    form: FormGroup;
    allItems: ItemEntity[] = [];
    errors: {
        [key: string]: string[]
    } = {};
    filteredOptions: ItemEntity[] = [];
    private $destroyed = new Subject();

    get loading() {
        return this._loading;
    }

    set loading(isLoading) {
        if (isLoading && !!this.form) {
            this.form.disable();
        } else if (!!this.form) {
            this.form.enable();
        }

        this._loading = isLoading;
    }

    constructor(
        public orderService: OrderService,
        public itemService: ItemService,
        public dialogRef: MatDialogRef<OrderItemFormDialogComponent>,
        public toastr: ToastService,
        public changeRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public data: any,
        fb: FormBuilder
    ) {
        this.editMode = true;
        const item: any = null;
        this.form = fb.group({
            id: [item ? item.id : null],
            quantity: [item ? item.quantity : 1, Validators.required],
            price: [item ? item.price : 0, Validators.required],
            cost: [item ? item.cost : 0, Validators.required],
            discount: [item ? item.discount : null],
            item_id: [item ? item.item_id : null, Validators.required],
            observation: item ? item.observation : null
        });
        this.form.valueChanges
            .pipe(
                takeUntil(this.$destroyed),
                distinctUntilChanged()
            )
            .subscribe((value) => this.computePrice(value));
        this.loading = true;
        this.itemService.all().subscribe(items => {
            this.allItems = items;
            this.filteredOptions = this.allItems.slice();
            this.loading = false;
        });
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
            }, { onlySelf: false, emitEvent: false });
        } else {
            this.form.patchValue({
                price: 0,
                cost: 0,
            }, { onlySelf: false, emitEvent: false });
        }
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
