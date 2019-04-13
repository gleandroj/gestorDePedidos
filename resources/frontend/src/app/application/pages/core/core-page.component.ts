import { Component, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ObservableMedia, MediaChange } from '@angular/flex-layout';
import { AuthService } from '../../../core/services';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSidenav, MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { AuthEntity } from '../../../core/entities/auth-entity';
import { menus as MENUS } from '../../menus';
import { BreadcrumbService, ToastService } from '../../../support/services';

@Component({
    selector: 'app-core-page',
    templateUrl: './core-page.component.html',
    styleUrls: [
        './core-page.component.less'
    ]
})
export class CorePageComponent implements OnDestroy {
    watcher: Subscription;
    activeMedia: String = '';
    sideMode: String = 'side';
    isSideOpen = true;
    @ViewChild(MatSidenav) sidenav: MatSidenav;
    canGoBack = false;
    user: AuthEntity;
    menus = MENUS;
    title = '';

    constructor(
        private media: ObservableMedia,
        private auth: AuthService,
        private router: Router,
        private dialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
        private toastr: ToastService,
        private breadcrumbService: BreadcrumbService
    ) {
        this.iconRegistry.addSvgIcon(
            'fastfood-svg',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/fastfood.svg')
        );
        this.watcher = this.media.subscribe((change: MediaChange) => this.onMediaChange(change.mqAlias));
        this.auth.currentUserSubject.subscribe(user => this.user = user);
        this.auth.unauthorizedEvent.subscribe(() => this.sidenav.close());
        this.breadcrumbService.breadcrumbs().subscribe((data) => {
            this.canGoBack = data.length > 2;
            this.title = data.map(_ => _.label).join(' - ');
            this.isSideOpen = false;
        });
    }

    onMediaChange(media: String) {
        this.activeMedia = media;
        if (this.activeMedia === 'xs' || this.activeMedia === 'sm') {
            this.sideMode = 'over';
            this.isSideOpen = false;
        } else {
            this.sideMode = 'over';
            this.isSideOpen = false;
        }
    }

    onSidenavChange() {
        if (this.isSideOpen !== this.sidenav.opened) {
            this.isSideOpen = this.sidenav.opened;
        }
    }

    toggleSideNav() {
        this.isSideOpen = !this.isSideOpen;
    }

    ngOnDestroy(): void {
        this.watcher.unsubscribe();
    }

    logout() {
        const goToLoginPage = () => this.router.navigate(['/auth/login']);
        this.auth.logout().subscribe(goToLoginPage, goToLoginPage);
    }

    call(item: any) {
        if (!this.isAuthorized(item)) {
            this.toastr.open('Usuário sem permissão para acessar o recurso.');
            this.sidenav.close();
            return;
        }
        const fn = this[item.action];
        return fn.bind(this).call();
    }

    goBack() {
        this.breadcrumbService.goBack().subscribe();
    }

    isAuthorized(item: any) {
        const authUser = this.auth.currentUser;
        const authorization = item['authorization'];
        return !authorization || authorization.length === 0 || authorization.indexOf(authUser.role) > -1;
    }
}
