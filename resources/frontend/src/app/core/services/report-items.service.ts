import {Injectable} from '@angular/core';
import {AbstractService} from '../../support/services';
import {Observable} from 'rxjs';
import {PaginatorData} from '../../support/interfaces';

@Injectable({
    providedIn: 'root'
})
export class ReportItemsService extends AbstractService<any> {
    protected resourceURL = 'report/items';

    public paginate(page, perPage?, sortable?: { key?: string, direction: 'asc' | 'desc' }, filter?: any): Observable<PaginatorData<any>> {
        const defaultParameters = {
            order_by: sortable ? sortable.key : null,
            direction: sortable ? sortable.direction : null,
            page: page,
            per_page: perPage,
            filter: filter
        };

        return this.http.post<PaginatorData<any>>(`${this.baseURL}/${this.resourceURL}`, defaultParameters);
    }

}
