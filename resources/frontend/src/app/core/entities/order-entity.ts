import {BaseEntity} from './base-entity';
import {OrderItemEntity} from './order-item-entity';

export interface OrderEntity extends BaseEntity {
    ordered_at: Date;
    table: string;
    items: OrderItemEntity[];
    is_done: boolean;
}
