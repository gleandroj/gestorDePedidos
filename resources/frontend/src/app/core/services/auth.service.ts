import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {AuthEntity, AuthTokenEntity} from '../entities/auth-entity';
import {catchError, switchMap, tap} from 'rxjs/operators';
import {LocalStorage} from 'ngx-webstorage';
import {ApiResponse} from '../../support/interfaces/api-response';
import {MatDialog} from '@angular/material';

export const authConfig = {
    loginEndPoint: '/api/auth/login',
    refreshEndPoint: '/api/auth/refresh',
    logoutEndPoint: '/api/auth/logout',
    currentUserEndPoint: '/api/auth/current',
    resetPasswordEndPoint: '/api/auth/password/reset',
    recoveryPasswordEndPoint: '/api/auth/password/email',
    registerUserEndPoint: '/api/auth/register',
    checkPasswordTokenEndPoint: '/api/auth/password/token',
    loginRoute: ['/auth/login']
};

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    @LocalStorage('current-user')
    protected _currentUser: AuthEntity;

    public currentUserSubject: BehaviorSubject<AuthEntity> = new BehaviorSubject<AuthEntity>(null);

    public unauthorizedEvent = new EventEmitter();

    @LocalStorage('auth-token')
    public _authToken: AuthTokenEntity;

    public set currentUser(token: AuthEntity) {
        this._currentUser = token;
        this.currentUserSubject.next(token);
    }

    public get currentUser(): AuthEntity {
        return this._currentUser;
    }

    public set authToken(token: AuthTokenEntity) {
        this._authToken = token;
    }

    public get authToken(): AuthTokenEntity {
        return this._authToken;
    }

    constructor(
        private dialogService: MatDialog,
        private http: HttpClient
    ) {
        this.initialize();
    }

    private initialize() {
        this.currentUserSubject.next(this._currentUser);
    }

    /**
     * @param email
     * @param password
     */
    public login(email: string, password: string): Observable<{ token: AuthTokenEntity, user: AuthEntity }> {
        return this.http.post<{ token: AuthTokenEntity, user: AuthEntity }>(authConfig.loginEndPoint, {
            email: email,
            password: password
        }).pipe(
            tap((response) => {
                this.authToken = response.token;
                this.currentUser = response.user;
            })
        );
    }

    /**
     * @returns {Observable<AuthTokenEntity>}
     */
    public refresh(): Observable<AuthTokenEntity> {
        const authToken = this.authToken;
        return this.http.post<AuthTokenEntity>(authConfig.refreshEndPoint, {
            'refresh_token': authToken ? authToken.refresh_token : ''
        }).pipe(
            tap((token: AuthTokenEntity) => this.authToken = token)
        );
    }

    /**
     * @returns {boolean}
     */
    public isAuthenticated() {
        return this._authToken != null;
    }

    /**
     * @returns {Observable<any>}
     */
    public logout(ignore?: boolean): Observable<any> {
        this.dialogService.closeAll();
        const observable = ignore ? of({success: true}) : this.http.post(authConfig.logoutEndPoint, {});
        return observable.pipe(
            catchError(() => of({success: true})),
            switchMap((resp) => {
                this.authToken = this._authToken = null;
                this.currentUser = this._currentUser = null;
                return of(resp);
            })
        );
    }

    /**
     * @param {string} email
     * @returns {Observable<any>}
     */
    public passwordRecovery(email: string) {
        return this.http.post<any>(authConfig.recoveryPasswordEndPoint, {
            email: email
        });
    }

    /**
     * @param {string} token
     * @param {string} email
     * @returns {Observable<any>}
     */
    public checkResetToken(token: string, email: string) {
        return this.http.post<any>(authConfig.checkPasswordTokenEndPoint, {
            token: token,
            email: email
        });
    }

    /**
     * @param {string} email
     * @param {string} password
     * @param {string} passwordConfirmation
     * @param {string} token
     * @returns {Observable<any>}
     */
    public passwordReset(email: string, password: string, passwordConfirmation: string, token: string) {
        return this.http.post<any>(authConfig.resetPasswordEndPoint, {
            email: email,
            password: password,
            password_confirmation: passwordConfirmation,
            token: token
        }).pipe(switchMap((value) => {
                return this.login(email, password)
                    .pipe(switchMap(() => of(value)));
            })
        );
    }

    public register(data: any): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>(authConfig.registerUserEndPoint, data);
    }
}
