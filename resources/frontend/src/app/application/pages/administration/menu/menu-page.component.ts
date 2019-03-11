import { Component } from '@angular/core';
import { MenuService } from '../../../../core/services';
import { MenuEntity} from '../../../../core/entities/menu-entity';
import { MatDialog } from '@angular/material';
import { MenuFormDialogComponent } from '../../../dialogs';
import { AbstractTableComponent } from '../../../components';

@Component({
    selector: 'app-menu-page',
    templateUrl: './menu-page.component.html',
    styleUrls: [
        './menu-page.component.less'
    ],
})
export class MenuPageComponent extends AbstractTableComponent<MenuEntity> {

    public displayedColumns: string[] = [
        'item',
        'actions'
    ];

    public constructor(
        private menuService: MenuService,
        private dialogService: MatDialog
    ) {
        super();
    }

    public paginate(page?, perPage?, sortable?, filter?) {
        return this.menuService.paginate(
            page,
            perPage,
            sortable,
            filter
        );
    }

    edit(menu?: MenuEntity, title?: string) {
        this.dialogService.open(
            MenuFormDialogComponent,
            {
                data: {
                    menu: menu,
                    title: title
                },
                panelClass: 'dialog-fullscreen'
            }
        ).afterClosed().subscribe((data) => {
            if (data && menu) {
                Object.assign(menu, data);
            } else if (data) {
                this.paginator.data = [data].concat(this.paginator.data);
            }
        });
    }
}
