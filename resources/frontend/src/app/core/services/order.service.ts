import {Injectable} from '@angular/core';
import {AbstractService} from '../../support/services';
import {Observable, of} from 'rxjs';
import {OrderEntity} from '../entities/order-entity';

@Injectable({
    providedIn: 'root'
})
export class OrderService extends AbstractService<OrderEntity> {
    protected resourceURL = 'orders';

    all(): Observable<OrderEntity[]> {
        return of([
            {
                ordered_at: new Date(),
                table: '0',
                is_done: false,
                items: [
                    {
                        is_done: false,
                        item_id: 1,
                        quantity: 1,
                        observation: 'Remover cebola Remover cebola Remover cebola Remover cebola'
                    },
                    {is_done: false, item_id: 1, quantity: 2, observation: 'Remover cebola'},
                    {is_done: false, item_id: 2, quantity: 1, observation: 'Remover cebola'},
                    {is_done: false, item_id: 1, quantity: 3, observation: 'Remover cebola'},
                ]
            }
        ]);
    }
}
