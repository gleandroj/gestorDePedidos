import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {AuthService, authConfig} from '../services/auth.service';
import {HttpErrorResponse} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PasswordCheckResolve implements Resolve<any> {

    constructor(private authService: AuthService, private router: Router) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        if (!route.queryParams.token || !route.queryParams.email) {
            return of(null).pipe(tap(() => {
                this.router.navigate(authConfig.loginRoute);
            }));
        } else {
            return this.authService
                .checkResetToken(route.queryParams.token, route.queryParams.email)
                .pipe(catchError((err: HttpErrorResponse) => {
                    return of(null).pipe(tap(() => {
                        this.router.navigate(authConfig.loginRoute);
                    }));
                }));
        }
    }
}
