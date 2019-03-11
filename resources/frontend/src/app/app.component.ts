import {Component} from '@angular/core';
import {BreadCrumb, BreadcrumbService} from './support/services';
import {Title} from '@angular/platform-browser';

@Component({
    selector: 'app-root',
    template: '<router-outlet></router-outlet>',
})
export class AppComponent {

    constructor(
        private breadcrumbService: BreadcrumbService,
        protected titleService: Title
    ) {
        this.breadcrumbService.breadcrumbs().subscribe((b) => this.setTitle(b));
    }

    setTitle(b: Array<BreadCrumb>) {
        const title = b.map(_ => _.label).join(' - ');
        this.titleService.setTitle(title);
    }
}
