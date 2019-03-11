import {Injectable} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {distinctUntilChanged, filter, map, startWith} from 'rxjs/operators';
import {BehaviorSubject, from, throwError} from 'rxjs';

export interface BreadCrumb {
    label: string;
    url: string;
    params?: Array<any>;
    last: boolean;
}

@Injectable()
export class BreadcrumbService {
    private _breadcrumbs: BehaviorSubject<Array<BreadCrumb>> = new BehaviorSubject<Array<BreadCrumb>>([]);

    public constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                distinctUntilChanged(),
                map(event => this.buildBreadCrumb(this.activatedRoute.root)),
                startWith(this.buildBreadCrumb(this.activatedRoute.root))
            ).subscribe((b) => this._breadcrumbs.next(b));
    }

    private buildBreadCrumb(route: ActivatedRoute, url: string = '',
                            breadcrumbs: Array<BreadCrumb> = []): Array<BreadCrumb> {

        let options = route.routeConfig && route.routeConfig.data ?
            route.routeConfig.data['breadcrumb'] : {};

        options = options instanceof Function ? options(route.snapshot ? route.snapshot.params : {}) : options;

        const config = {
            parent: options instanceof Object ? options.parent : null,
            label: options instanceof Object ? options.label : options
        };

        const path = route.snapshot ? route.snapshot.url.join('/') : '';
        const nextUrl = `${url}${path}/`;
        const breadcrumb = {
            label: config.label,
            url: nextUrl,
            last: false
        };
        const newBreadcrumbs = [...breadcrumbs, breadcrumb];

        if (route.firstChild) {
            return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
        }
        const result = newBreadcrumbs.filter(b => b.label != null);
        return result.map((r, i) => {
            r.last = (i === (result.length - 1));
            return r;
        });
    }

    public goBack() {
        const breadcrumbs = this._breadcrumbs.getValue();
        const b = breadcrumbs[breadcrumbs.length - 2];
        if (b) {
            return from(this.router.navigate([b.url]));
        }
        return throwError('Can\'t go back');
    }

    public breadcrumbs() {
        return this._breadcrumbs.asObservable();
    }
}
