import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastService} from '../../../support/services';
import {HttpErrorResponse} from '@angular/common/http';
import {ApiException} from '../../../support/interfaces/api-exception';
import {OrderEntity} from '../../../core/entities/order-entity';
import {OrderService} from '../../../core/services/order.service';
import {Observable} from 'rxjs';
import {ItemEntity} from '../../../core/entities/item-entity';
import {ItemService} from '../../../core/services';
import {map, publishReplay, refCount} from 'rxjs/operators';
import {OrderItemEntity} from '../../../core/entities/order-item-entity';

@Component({
    selector: 'app-order-form-dialog',
    templateUrl: './order-form-dialog.component.html',
    styleUrls: [
        './order-form-dialog.component.less'
    ],
})
export class OrderFormDialogComponent {
    public loading = false;
    editMode = false;
    title = 'Formulário';
    form: FormGroup;
    order: OrderEntity;
    menus: Observable<ItemEntity[]> = this.menuService.all().pipe(
        publishReplay(1),
        refCount(),
    );
    errors: {
        [key: string]: string[]
    } = {};
    filteredOptions: { [key: number]: Observable<ItemEntity[]> } = {};

    constructor(
        public orderService: OrderService,
        public menuService: ItemService,
        public dialogRef: MatDialogRef<OrderFormDialogComponent>,
        public toastr: ToastService,
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
        if (this.order.items) {
            this.order.items.forEach((i) => this.addItem(i));
        }
    }

    get items() {
        return this.form.get('items') as FormArray;
    }

    filter(event: any, index: number) {
        const item = event.target.value;
        this.filteredOptions[index] = this.menus.pipe(
            map(m => item ?
                m.filter(_ => _.description.toLowerCase().indexOf(item) === 0)
                : m.slice()
            )
        );
    }

    buildItem(item?: OrderItemEntity) {
        return this.fb.group({
            quantity: [item ? item.quantity : 1, Validators.required],
            item_id: [item ? item.item_id : null, Validators.required],
            observation: item ? item.observation : ''
        });
    }

    addItem(item?: OrderItemEntity) {
        this.items.insert(0, this.buildItem(item));
        this.filteredOptions[this.items.length - 1] = this.menus;
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
