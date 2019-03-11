import {HttpClient} from '@angular/common/http';
import {PaginatorData} from '../interfaces';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ApiResponse} from '../interfaces/api-response';
import {Injectable} from '@angular/core';

@Injectable()
export abstract class AbstractService<T> {

    protected baseURL = '/api';

    protected abstract get resourceURL();

    constructor(protected http: HttpClient) {}

    public all(): Observable<T[]> {
        return this.http.get<ApiResponse<T[]>>(
            `${this.baseURL}/${this.resourceURL}/`
        ).pipe(map((r) => r.data));
    }

    public paginate(page, perPage?, sortable?: { key?: string, direction: 'asc' | 'desc' }, filter?: any): Observable<PaginatorData<T>> {
        const defaultParameters = {
            order_by: sortable ? sortable.key : null,
            direction: sortable ? sortable.direction : null,
            page: page,
            per_page: perPage,
        };
        const filterParameters = this.formatFilter(filter);
        const parameters = this.buildParameter({
            ...defaultParameters,
            ...filterParameters
        });

        return this.http.get<PaginatorData<T>>(`${this.baseURL}/${this.resourceURL}?${parameters}`);
    }

    public find(id): Observable<T> {
        return this.http.get<ApiResponse<T>>(`${this.baseURL}/${this.resourceURL}/${id}`)
            .pipe(map((resp: ApiResponse<T>) => resp.data));
    }

    public save(entity: T | any): Observable<T> {
        let response = null;

        if (entity.id == null) {
            response = this.http.post<ApiResponse<T>>(`${this.baseURL}/${this.resourceURL}`, entity);
        } else {
            response = this.http.put<ApiResponse<T>>(`${this.baseURL}/${this.resourceURL}/${entity.id}`, entity);
        }

        return response.pipe(map((resp: ApiResponse<T>) => resp.data));
    }

    public delete(id): Observable<T> {
        return this.http.delete<any>(`${this.baseURL}/${this.resourceURL}/${id}`)
            .pipe(map((resp: any) => resp));
    }

    protected buildParameter(data: any) {
        const _filter = Object.keys(data).map(k => {
            return data[k] ? `${k}=${data[k]}` : null;
        });
        return _filter.filter(f => f != null).join('&');
    }

    protected formatFilter(filter: any): any {
        filter = filter ? filter : {};
        const data = {};
        Object.keys(filter).map(k => {
            data[`filter[${k}]`] = filter[k];
            return k;
        });
        return data;
    }
}
