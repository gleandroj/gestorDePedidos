import {Injectable} from '@angular/core';
import {AbstractService} from '../../support/services';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DashboardService extends AbstractService<any> {
    protected resourceURL = 'dashboard';

    data(filter: any): Observable<any> {
        return this.http.post(`${this.baseURL}/${this.resourceURL}/data`, filter || {});
    }
}
