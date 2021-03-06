import {PaginatorData} from '../../../support/interfaces';
import {BehaviorSubject, Observable} from 'rxjs';
import {OnInit} from '@angular/core';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {MatDialog} from '@angular/material';
import {ConfirmDialogComponent} from '../../dialogs';

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
    public filter: any = {};
    public abstract displayedColumns: string[];
    public loading = true;
    public searchSubject = new BehaviorSubject(null);
    public sortable: { key: string; direction: 'asc' | 'desc' } = null;

    public constructor(protected dialogService: MatDialog, initialFilter: any = {}) {
        Object.assign(this.filter, initialFilter);
    }

    public abstract paginate(page?, perPage?, sortable?, filter?): Observable<PaginatorData<T>>;

    public confirm(message?: string) {
        return this.dialogService.open(
            ConfirmDialogComponent,
            {
                data: {
                    message: message
                },
                panelClass: 'dialog-fullscreen'
            }
        ).afterClosed();
    }

    public processPaginate(page?, perPage?) {
        this.loading = true;
        this.paginate(page, perPage, this.sortable, this.filter)
            .pipe(tap(() => this.loading = false, () => this.loading = false))
            .subscribe((data) => this.paginator = data);
    }

    public ngOnInit(): void {
        this.searchSubject.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            tap((val) => this.filter.query = val)
        ).subscribe(() => this.refresh());
    }

    public refresh() {
        this.processPaginate(
            this.paginator.meta.current_page,
            this.paginator.meta.per_page
        );
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
            this.paginator.meta.per_page
        );
    }

}
