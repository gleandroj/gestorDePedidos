import {Injectable, Injector} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse} from '@angular/common/http';
import {from, Observable, of, throwError} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';
import {AuthService, authConfig} from '../services';
import {Router} from '@angular/router';
import {ToastService} from '../../support/services';

@Injectable()
export class Interceptor implements HttpInterceptor {

    protected get authService(): AuthService {
        return this.injector.get(AuthService);
    }

    protected get router(): Router {
        return this.injector.get(Router);
    }

    protected get toastr(): ToastService {
        return this.injector.get(ToastService);
    }

    constructor(private injector: Injector) {
    }

    authenticateRequest(request: HttpRequest<any>): HttpRequest<any> {
        const authService = this.authService;
        const isLoginRequest = request.url.indexOf(authConfig.loginEndPoint) > -1;
        if (isLoginRequest || !authService.isAuthenticated()
        ) {
            return request;
        }

        const authToken = authService.authToken;
        return request.clone({
            setHeaders: {
                Authorization: `${authToken.token_type} ${authToken.access_token}`
            }
        });
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(this.authenticateRequest(request))
            .pipe(
                catchError((resp: any) => this.catchError(resp, request, next))
            );
    }

    catchError(resp: any, request: HttpRequest<any>, next: HttpHandler) {
        const authService = this.authService;
        const router = this.router;
        const toastr = this.toastr;
        const loginRoute = authConfig.loginRoute;
        const isLogoutEndPoint = (resp.url.indexOf(authConfig.logoutEndPoint) > -1);
        const isLoginEndPoint = (resp.url.indexOf(authConfig.loginEndPoint) > -1);
        const isRefreshEndPoint = (resp.url.indexOf(authConfig.refreshEndPoint) > -1);

        if ((resp instanceof HttpErrorResponse) &&
            resp.status === 401 &&
            authService.isAuthenticated() &&
            !isLoginEndPoint && !isLogoutEndPoint &&
            !isRefreshEndPoint
        ) {

            return authService.refresh().pipe(
                switchMap((t) => this.intercept(request, next)),
                catchError((err: HttpErrorResponse) => {
                        if (err.status === 401) {
                            return from(router.navigate(loginRoute)).pipe(
                                switchMap(() => {
                                    toastr.open('Sessão expirada.');
                                    return this.authService.logout(true);
                                }),
                                switchMap(e => throwError(resp)),
                            );
                        }
                        return throwError(resp);
                    }
                )
            );
        } else if ((resp instanceof HttpErrorResponse) && resp.status === 403) {
            toastr.open(resp.error.message);
            router.navigate(['/sites/unauthorized']).then();
            return throwError(resp);
        }

        return throwError(resp);
    }
}
