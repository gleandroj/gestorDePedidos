import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../core/services';
import { BehaviorSubject } from 'rxjs';
import { PaginatorData } from '../../../../support/interfaces';
import { UserEntity, roles, genders } from '../../../../core/entities/user-entity';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { UserFormDialogComponent } from '../../../dialogs';
import { AbstractTableComponent } from '../../../components';

@Component({
    selector: 'app-users-page',
    templateUrl: './users-page.component.html',
    styleUrls: [
        './users-page.component.less'
    ],
})
export class UsersPageComponent extends AbstractTableComponent<UserEntity> {

    public displayedColumns: string[] = [
        'name',
        'email',
        'birthday',
        'cellphone',
        'gender',
        'role',
        'actions'
    ];

    public roles = roles;
    public genders = genders;

    public constructor(
        private userService: UserService,
        private dialogService: MatDialog
    ) {
        super();
    }

    public paginate(page?, perPage?, sortable?, filter?) {
        return this.userService.paginate(
            page,
            perPage,
            sortable,
            filter
        );
    }

    edit(user?: UserEntity, title?: string) {
        this.dialogService.open(
            UserFormDialogComponent,
            {
                data: {
                    user: user,
                    title: title
                },
                panelClass: 'dialog-fullscreen'
            }
        ).afterClosed().subscribe((data) => {
            if (data && user) {
                Object.assign(user, data);
            } else if (data) {
                this.paginator.data = [data].concat(this.paginator.data);
            }
        });
    }
}
