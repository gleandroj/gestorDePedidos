import {Component} from '@angular/core';
import {ReportItemsService} from '../../../core/services';
import {ItemEntity} from '../../../core/entities/item-entity';
import {MatDialog} from '@angular/material';
import {AbstractTableComponent} from '../../components';
import {ToastService} from '../../../support/services';
import {tap} from 'rxjs/operators';

@Component({
    selector: 'app-report-items-page',
    templateUrl: './report-items-page.component.html',
    styleUrls: [
        './report-items-page.component.less'
    ],
})
export class ReportItemsPageComponent extends AbstractTableComponent<ItemEntity> {

    public displayedColumns: string[] = [
        'item',
        'quantity',
        'price',
        'cost'
    ];

    public constructor(
        private reportItemsService: ReportItemsService,
        private toastr: ToastService,
        dialogService: MatDialog
    ) {
        super(dialogService, {interval: [null, null]});
    }

    public paginate(page?, perPage?, sortable?, filter?) {
        return this.reportItemsService.paginate(
            page,
            perPage,
            sortable,
            filter
        ).pipe(
            tap((data) => {
                this.filter.interval = (<any>data).interval;
            })
        );
    }
}
