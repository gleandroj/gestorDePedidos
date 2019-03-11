import {Injectable} from '@angular/core';
import {AbstractService} from '../../support/services';
import {OrderEntity} from '../entities/order-entity';

@Injectable({
    providedIn: 'root'
})
export class OrderService extends AbstractService<OrderEntity> {
    protected resourceURL = 'orders';
}
