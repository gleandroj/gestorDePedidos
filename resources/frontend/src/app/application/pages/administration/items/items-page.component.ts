import { Component } from '@angular/core';
import { ItemService } from '../../../../core/services';
import { ItemEntity} from '../../../../core/entities/item-entity';
import { MatDialog } from '@angular/material';
import { ItemFormDialogComponent } from '../../../dialogs';
import { AbstractTableComponent } from '../../../components';

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
        'actions'
    ];

    public constructor(
        private itemService: ItemService,
        private dialogService: MatDialog
    ) {
        super();
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
}
