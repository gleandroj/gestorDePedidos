import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../../../support/services';

@Component({
    selector: 'app-register-page',
    templateUrl: './register-page.component.html',
    styleUrls: [
        './register-page.component.less'
    ]
})
export class RegisterPageComponent {
    public signupForm: FormGroup;
    public loading = false;
    public sexos = [
        { label: 'Masculino', value: 'M' },
        { label: 'Feminino', value: 'F' }
    ];

    constructor(
        private route: Router,
        fb: FormBuilder,
        private auth:
            AuthService,
        public toastr: ToastService
    ) {
        if (this.auth.isAuthenticated()) {
            this.auth.logout().subscribe();
        }
        this.signupForm = fb.group({
            avatar: null,
            email: null,
            password: null,
            password_confirmation: null,
            name: null,
            birthday: null,
            gender: null,
            cellphone: null,
        });
    }
x
    onSubmit(value: any) {
        if (!this.signupForm.valid) {
            return;
        }

        this.loading = true;
        this.signupForm.disable();
        const data = value as any;

        this.auth.register(data).subscribe((response) => {
            this.auth.login(data.email, data.password)
                .subscribe((t) => {
                    this.loading = false;
                    this.route.navigate(['/bufallus']);
                    this.toastr.open(response.data.message);
                });
        }, (error: HttpErrorResponse) => {
            this.loading = false;
            const _error = error.error;
            let message = 'Ops! Algo deu errado, tente novamente.';
            if (error.status === 422 && _error.data['email']) {
                message = _error.data['email'][0];
            }
            this.toastr.open(message);
            this.signupForm.enable();
        });
    }
}
