import {Injectable} from '@angular/core';
import {AbstractService} from '../../support/services';
import {OrderEntity} from '../entities/order-entity';
import {Observable} from 'rxjs';
import {ApiResponse} from '../../support/interfaces/api-response';
import {map} from 'rxjs/operators';
import {OrderItemEntity} from '../entities/order-item-entity';

@Injectable({
    providedIn: 'root'
})
export class OrderService extends AbstractService<OrderEntity> {
    protected resourceURL = 'orders';

    public all(filter?: any): Observable<OrderEntity[]> {
        const parameters = this.buildParameter(this.formatFilter(filter));
        return this.http.get<ApiResponse<OrderEntity[]>>(
            `${this.baseURL}/${this.resourceURL}?${parameters}`
        ).pipe(map((r) => r.data));
    }

    print(order: OrderEntity, itemsToPrint: OrderItemEntity[]) {
        return this.http.post<ApiResponse<OrderEntity[]>>(
            `${this.baseURL}/${this.resourceURL}/${order.id}/print`,
            {
                items_to_print: itemsToPrint.map(i => i.id)
            }
        ).pipe(map((r) => r.data));
    }
}
