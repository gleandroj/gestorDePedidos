import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MenuEntity} from '../../../core/entities/menu-entity';
import {MenuService} from '../../../core/services';
import {ToastService} from '../../../support/services';
import {HttpErrorResponse} from '@angular/common/http';
import {ApiException} from '../../../support/interfaces/api-exception';

@Component({
    selector: 'app-menu-form-dialog',
    templateUrl: './menu-form-dialog.component.html',
    styleUrls: [
        './menu-form-dialog.component.less'
    ],
})
export class MenuFormDialogComponent {
    public loading = false;
    editMode = false;
    title = 'Formulário';
    form: FormGroup;
    menu: MenuEntity;
    errors: {
        [key: string]: string[]
    } = {};

    constructor(
        public menuService: MenuService,
        public dialogRef: MatDialogRef<MenuFormDialogComponent>,
        public toastr: ToastService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        fb: FormBuilder
    ) {
        this.title = data.title ? data.title : this.title;
        this.menu = data.menu ? data.menu : {};
        this.editMode = !!data.menu;
        this.form = fb.group({
            id: this.menu.id,
            item: this.menu.item
        });
    }

    save() {
        this.loading = true;
        this.menuService.save(this.form.value).subscribe((menu) => {
            this.loading = false;
            if (this.editMode) {
                this.toastr.open(
                    'Item atualizado com sucesso!'
                );
            } else {
                this.toastr.open(
                    'Item cadastrado com sucesso!'
                );
            }

            this.dialogRef.close(menu);
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
