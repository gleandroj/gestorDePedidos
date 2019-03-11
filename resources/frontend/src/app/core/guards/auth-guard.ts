import {Injectable} from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router,
    CanActivateChild
} from '@angular/router';
import {AuthService, authConfig} from '../services';
import {Observable} from 'rxjs';
import {ToastService} from '../../support/services';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

    constructor(private router: Router,
                private auth: AuthService,
                private toastr: ToastService) {
    }

    check(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        const authUser = this.auth.currentUser;
        const redirectUrl = `${state.url}`;
        const authPath = authConfig.loginRoute;
        const isLoggedIn = this.auth.isAuthenticated();
        const authorization = route.data['authorization'];
        const isAuthorized = !authorization || authorization.lenght === 0 || authorization.indexOf(authUser.role) > -1;
        if (isLoggedIn && isAuthorized) {
            return true;
        } else if (isLoggedIn) {
            this.toastr.open('Usuário sem permissão para acessar o recurso.');
            this.auth.unauthorizedEvent.emit({
                route: route,
                user: authUser
            });
            return false;
        } else {
            this.router.navigate(authPath, {queryParams: {url: redirectUrl}});
            return false;
        }
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.check(childRoute, state);
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.check(route, state);
    }
}
