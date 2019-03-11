import {PaginatorData} from '../../../support/interfaces';
import {BehaviorSubject, Observable} from 'rxjs';
import {OnInit} from '@angular/core';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';

export abstract class AbstractTableComponent<T> implements OnInit {

    public search = '';
    public paginator: PaginatorData<T> = {
        meta: {
            total: 0,
            current_page: 0,
            per_page: 10
        },
        data: []
    };
    public get filter() {
        return {
            query: this.searchSubject.getValue()
        };
    }

    public abstract displayedColumns: string[];

    public loading = true;

    public searchSubject = new BehaviorSubject(null);

    public sortable: { key: string; direction: 'asc' | 'desc' } = null;

    public abstract paginate(page?, perPage?, sortable?, filter?): Observable<PaginatorData<T>>;

    public processPaginate(page?, perPage?, sortable?, filter?) {
        this.loading = true;
        this.paginate(page, perPage, sortable, filter)
            .pipe(tap(() => this.loading = false, () => this.loading = false))
            .subscribe((data) => this.paginator = data);
    }

    public ngOnInit(): void {
        this.searchSubject.pipe(
            debounceTime(500),
            distinctUntilChanged()
        ).subscribe(() => this.processPaginate(
            this.paginator.meta.current_page,
            this.paginator.meta.per_page,
            this.sortable,
            this.filter
        ));
    }

    public sortData($event) {
        this.sortable = null;
        if ($event.direction && $event.direction.length > 0) {
            this.sortable = {
                key: $event.active,
                direction: $event.direction
            };
        }
        this.processPaginate(
            this.paginator.meta.current_page,
            this.paginator.meta.per_page,
            this.sortable,
            this.filter
        );
    }

}
