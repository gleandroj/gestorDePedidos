import {Injectable} from '@angular/core';
import {AbstractService} from '../../support/services';

@Injectable({
    providedIn: 'root'
})
export class UserService extends AbstractService<any> {
    protected resourceURL = 'users';
}