import {Component, OnInit} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AuthService} from '../../../../core/services';
import {ToastService} from '../../../../support/services';

@Component({
    selector: 'app-login-page',
    templateUrl: 'login-page.component.html',
    styleUrls: ['./login-page.component.less']
})
export class LoginPageComponent implements OnInit {

    public loginForm: FormGroup;
    public redirectUrl: String;
    public defaultRedirectUrl: String = '/bufallus/';
    public loading = false;

    constructor(
        activatedRoute: ActivatedRoute,
        private route: Router, fb: FormBuilder,
        private auth: AuthService,
        public toastr: ToastService
    ) {
        activatedRoute.queryParams.subscribe(
            (queryParam: any) => this.redirectUrl = queryParam['url']
        );
        this.loginForm = fb.group({
            username: null,
            password: null
        });
    }

    ngOnInit() {
        if (this.auth.isAuthenticated()) {
            this.auth.logout().subscribe();
        }
    }

    onSubmit(value: any) {
        this.loading = true;
        this.loginForm.disable();
        this.auth.login(value.username, value.password).subscribe((token) => {
            this.route.navigate([this.redirectUrl || this.defaultRedirectUrl]);
        }, (error: HttpErrorResponse) => {
            this.loading = false;
            const _error = error.error;
            this.loginForm.enable();
            this.toastr
                .open(
                    _error.message
                );
        });
    }
}
