import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {authConfig, AuthService} from '../../../../core/services';
import {HttpErrorResponse} from '@angular/common/http';
import {ToastService} from '../../../../support/services';

@Component({
    selector: 'app-forget-password-page',
    templateUrl: 'reset-password-page.component.html',
    styleUrls: ['./reset-password-page.component.less']
})
export class ResetPasswordPageComponent implements OnInit {

    public resetForm: FormGroup;
    public loading = false;
    private email: any;
    private token: any;

    constructor(
        private activatedRoute: ActivatedRoute,
        private route: Router,
        fb: FormBuilder,
        private auth: AuthService,
        public toastr: ToastService
    ) {
        this.resetForm = fb.group({
            username: new FormControl({value: '', disabled: true}),
            password: null,
            password_confirmation: null
        });
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params => {
            if (!params['email'] || !params['token']) {
                this.route.navigate(['auth/login']);
                return;
            }

            this.resetForm.setValue({
                username: params['email'],
                password: null,
                password_confirmation: null
            });
            this.email = params['email'];
            this.token = params['token'];
        });
    }

    onSubmit(value: any) {
        this.loading = true;
        this.auth.passwordReset(
            this.email,
            value.password,
            value.password_confirmation,
            this.token
        ).subscribe((response) => {
            this.auth.login(this.email, value.password).subscribe(() => {
                this.toastr.open(response.status);
                this.loading = false;
                this.route.navigate(['/sites/']);
            });
        }, (response: HttpErrorResponse) => {
            this.loading = false;
            if (response.error.error === 'passwords.token') {
                this.route.navigate(authConfig.loginRoute);
            }
            this.toastr.open(response.error.message);
        });
    }

}
