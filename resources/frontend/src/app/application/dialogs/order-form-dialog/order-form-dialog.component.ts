import {ChangeDetectorRef, Component, Inject, OnDestroy} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ToastService} from '../../../support/services';
import {HttpErrorResponse} from '@angular/common/http';
import {OrderEntity} from '../../../core/entities/order-entity';
import {OrderService} from '../../../core/services/order.service';
import {Subject} from 'rxjs';

interface DialogOptions {
    title?: string;
    order?: OrderEntity;
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
        public orderService: OrderService,
        public dialogRef: MatDialogRef<OrderFormDialogComponent>,
        public toastr: ToastService,
        public changeRef: ChangeDetectorRef,
        private dialogService: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: DialogOptions,
        private fb: FormBuilder
    ) {
        this.title = data.title || this.title;
        this.order = data.order || {};
        this.editMode = !!this.order.id;
        this.form = fb.group({
            id: this.order.id,
            table: this.order.table
        });
    }

    save() {
        this.loading = true;
        this.orderService.save(this.form.value).subscribe((order) => {
            this.loading = false;
            if (this.form.value.id) {
                this.toastr.open(
                    'Mesa atualizada com sucesso!'
                );
            } else {
                this.toastr.open(
                    'Mesa cadastrada com sucesso!'
                );
            }
            this.dialogRef.close(order);
        }, (response: HttpErrorResponse) => {
            this.loading = false;
            if (this.form.value.id) {
                this.toastr.open(
                    'Oops! Falha ao atualizar mesa.'
                );
            } else {
                this.toastr.open(
                    'Oops! Falha ao cadastrar mesa.'
                );
            }
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
