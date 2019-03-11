import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {authConfig, AuthService} from '../../../../core/services';
import {HttpErrorResponse} from '@angular/common/http';
import {ToastService} from '../../../../support/services';

@Component({
    selector: 'app-forget-password-page',
    templateUrl: 'forget-password-page.component.html',
    styleUrls: ['./forget-password-page.component.less']
})
export class ForgetPasswordPageComponent {

    public recoveryForm: FormGroup;
    public loading = false;

    constructor(
        private route: Router,
        fb: FormBuilder,
        private auth: AuthService,
        public toastr: ToastService
    ) {
        this.recoveryForm = fb.group({
            username: null
        });
    }

    onSubmit(value: any) {
        this.loading = true;
        this.recoveryForm.disable();
        this.auth.passwordRecovery(value.username).subscribe((response) => {
            this.toastr.open(response.status);
            this.route.navigate(authConfig.loginRoute);
        }, (response: HttpErrorResponse) => {
            this.loading = false;
            this.recoveryForm.enable();
            this.toastr.open(response.error.message);
        });
    }

}
