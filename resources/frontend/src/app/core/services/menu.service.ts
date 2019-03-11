import {Injectable} from '@angular/core';
import {AbstractService} from '../../support/services';
import { MenuEntity } from '../entities/menu-entity';

@Injectable({
    providedIn: 'root'
})
export class MenuService extends AbstractService<MenuEntity> {
    protected resourceURL = 'menus';
}
