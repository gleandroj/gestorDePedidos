import {Injectable} from '@angular/core';
import {AbstractService} from '../../support/services';
import {ItemEntity} from '../entities/item-entity';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ItemService extends AbstractService<ItemEntity> implements Resolve<ItemEntity[]> {
    protected resourceURL = 'items';

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ItemEntity[]> | Promise<ItemEntity[]> | ItemEntity[] {
        return this.all();
    }
}
