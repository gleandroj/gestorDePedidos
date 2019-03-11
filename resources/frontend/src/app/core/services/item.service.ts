import {Injectable} from '@angular/core';
import {AbstractService} from '../../support/services';
import {ItemEntity} from '../entities/item-entity';

@Injectable({
    providedIn: 'root'
})
export class ItemService extends AbstractService<ItemEntity> {
    protected resourceURL = 'items';
}
