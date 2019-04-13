import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastService } from '../../../support/services';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiException } from '../../../support/interfaces/api-exception';
import { OrderEntity } from '../../../core/entities/order-entity';
import { OrderService } from '../../../core/services/order.service';
import { ItemEntity } from '../../../core/entities/item-entity';
import { ItemService } from '../../../core/services';
import { OrderItemEntity } from '../../../core/entities/order-item-entity';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { OrderItemFormDialogComponent } from '../order-item-form-dialog/order-item-form-dialog.component';

interface DialogOptions {
    title?: string;
    order?: OrderEntity;
    items?: ItemEntity[];
}

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
        public dialogRef: MatDialogRef<OrderFormDialogComponent>,
        public toastr: ToastService,
        public changeRef: ChangeDetectorRef,
        private dialogService: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: DialogOptions,
        private fb: FormBuilder
    ) {
        this.title = data.title || this.title;
        this.order = data.order || {};
        this.allItems = data.items || [];
        this.editMode = !!data.order;
        this.form = fb.group({
            id: this.order.id,
            table: this.order.table,
            items: fb.array(
                (this.order.items || []).map(item => this.fb.control(item)),
                [Validators.required]
            )
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

    getItemById(id) {
        return this.allItems.find(i => i.id === id);
    }

    addItem() {
        this.dialogService.open(
            OrderItemFormDialogComponent,
            {
                data: {
                    item: {},
                    title: 'Adicionar Item',
                    items: this.allItems
                },
                panelClass: ['dialog-fullscreen', 'no-padding']
            }
        ).afterClosed().subscribe((item) => {
            if (item) {
                this.items.push(this.fb.control(item));
            }
        });
    }

    editItem(control: FormControl) {
        this.dialogService.open(
            OrderItemFormDialogComponent,
            {
                data: {
                    item: control.value,
                    title: 'Editar Item',
                    items: this.allItems
                },
                panelClass: ['dialog-fullscreen', 'no-padding']
            }
        ).afterClosed().subscribe((item) => {
            if (item) {
                control.setValue(item);
            }
        });
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
}
