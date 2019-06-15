import {BaseEntity} from './base-entity';
import {OrderItemEntity} from './order-item-entity';

export interface OrderEntity extends BaseEntity {
    table: string;
    items: OrderItemEntity[];
    is_done: boolean;
    finalized_at: string;
}
