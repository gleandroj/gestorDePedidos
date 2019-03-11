import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {AbstractService} from '../../support/services';
import {Observable} from 'rxjs';

@Injectable()
export abstract class AbstractResolve<T> implements Resolve<T> {

    protected constructor(private service: AbstractService<T>) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<T> | Promise<T> | T {
        return this.service.find(route.params.id);
    }
}
