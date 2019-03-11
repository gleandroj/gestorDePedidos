import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UserEntity} from '../../../core/entities/user-entity';
import {MaskPipe} from 'ngx-mask';
import {UserService} from '../../../core/services';
import {ToastService} from '../../../support/services';
import {HttpErrorResponse} from '@angular/common/http';
import {ApiException} from '../../../support/interfaces/api-exception';

@Component({
    selector: 'app-user-form-dialog',
    templateUrl: './user-form-dialog.component.html',
    styleUrls: [
        './user-form-dialog.component.less'
    ],
})
export class UserFormDialogComponent {
    public loading = false;
    public sexos = [
        {label: 'Masculino', value: 'M'},
        {label: 'Feminino', value: 'F'}
    ];

    editMode = false;
    title = 'Formulário';
    form: FormGroup;
    user: UserEntity;
    errors: {
        [key: string]: string[]
    } = {};

    constructor(
        public userService: UserService,
        public dialogRef: MatDialogRef<UserFormDialogComponent>,
        public toastr: ToastService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        fb: FormBuilder,
        mask: MaskPipe
    ) {
        this.title = data.title ? data.title : this.title;
        this.user = data.user ? data.user : {};
        this.editMode = !!data.user;
        this.form = fb.group({
            id: this.user.id,
            email: this.user.email,
            name: this.user.name,
            birthday: this.user.birthday,
            gender: this.user.gender,
            cellphone: this.user.cellphone ? mask.transform(this.user.cellphone, '(99) 99999-9999') : null,
            role: this.user.role,
            password: this.user.password,
            password_confirmation: this.user.password_confirmation,
        });
    }

    save() {
        this.loading = true;
        this.userService.save(this.form.value).subscribe((user) => {
            this.loading = false;
            if (this.editMode) {
                this.toastr.open(
                    'Usuário atualizado com sucesso!'
                );
            } else {
                this.toastr.open(
                    'Usuário cadastrado com sucesso!'
                );
            }

            this.dialogRef.close(user);
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
