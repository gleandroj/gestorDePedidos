import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ItemEntity} from '../../../core/entities/item-entity';
import {ItemService} from '../../../core/services';
import {ToastService} from '../../../support/services';
import {HttpErrorResponse} from '@angular/common/http';
import {ApiException} from '../../../support/interfaces/api-exception';

@Component({
    selector: 'app-item-form-dialog',
    templateUrl: './item-form-dialog.component.html',
    styleUrls: [
        './item-form-dialog.component.less'
    ],
})
export class ItemFormDialogComponent {
    public loading = false;
    editMode = false;
    title = 'Formulário';
    form: FormGroup;
    item: ItemEntity;
    errors: {
        [key: string]: string[]
    } = {};

    constructor(
        public itemService: ItemService,
        public dialogRef: MatDialogRef<ItemFormDialogComponent>,
        public toastr: ToastService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        fb: FormBuilder
    ) {
        this.title = data.title ? data.title : this.title;
        this.item = data.item ? data.item : {};
        this.editMode = !!data.item;
        this.form = fb.group({
            id: this.item.id,
            description: this.item.description
        });
    }

    save() {
        this.loading = true;
        this.itemService.save(this.form.value).subscribe((item) => {
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

            this.dialogRef.close(item);
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
