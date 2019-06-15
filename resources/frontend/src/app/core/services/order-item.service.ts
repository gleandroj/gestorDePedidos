import {Injectable} from '@angular/core';
import {AbstractService} from '../../support/services';
import {OrderItemEntity} from '../entities/order-item-entity';
import {OrderEntity} from '../entities/order-entity';

@Injectable({
    providedIn: 'root'
})
export class OrderItemService extends AbstractService<OrderItemEntity> {

    private order: OrderEntity;

    protected get resourceURL() {
        return 'orders/{order_item}/order_items'.replace('{order_item}', this.order && this.order.id.toString());
    }

    public setOrder(order: OrderEntity) {
        this.order = order;
        return this;
    }
}
