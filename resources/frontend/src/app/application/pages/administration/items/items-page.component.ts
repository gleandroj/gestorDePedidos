import {Component} from '@angular/core';
import {ItemService} from '../../../../core/services';
import {ItemEntity} from '../../../../core/entities/item-entity';
import {MatDialog} from '@angular/material';
import {ConfirmDialogComponent, ItemFormDialogComponent} from '../../../dialogs';
import {AbstractTableComponent} from '../../../components';
import {switchMap} from 'rxjs/operators';
import {ToastService} from '../../../../support/services';
import {EMPTY} from 'rxjs';

@Component({
    selector: 'app-items-page',
    templateUrl: './items-page.component.html',
    styleUrls: [
        './items-page.component.less'
    ],
})
export class ItemsPageComponent extends AbstractTableComponent<ItemEntity> {

    public displayedColumns: string[] = [
        'item',
        'price',
        'cost',
        'actions'
    ];

    public constructor(
        private itemService: ItemService,
        private toastr: ToastService,
        dialogService: MatDialog
    ) {
        super(dialogService);
    }

    public paginate(page?, perPage?, sortable?, filter?) {
        return this.itemService.paginate(
            page,
            perPage,
            sortable,
            filter
        );
    }

    edit(item?: ItemEntity, title?: string) {
        this.dialogService.open(
            ItemFormDialogComponent,
            {
                data: {
                    item: item,
                    title: title
                },
                panelClass: 'dialog-fullscreen'
            }
        ).afterClosed().subscribe((data) => {
            if (data && item) {
                Object.assign(item, data);
            } else if (data) {
                this.paginator.data = [data].concat(this.paginator.data);
            }
        });
    }

    delete(item: ItemEntity) {
        this.confirm('Tem certeza que deseja deletar?')
            .pipe(
                switchMap(
                    (confirm) => confirm ? this.itemService.delete(item.id) : EMPTY
                )
            )
            .subscribe((confirm) => {
                if (confirm) {
                    this.toastr.open('Item deletado com sucesso!');
                    this.paginator.data = this.paginator.data.filter(d => d.id !== item.id);
                }
            });
    }
}
