import {BaseEntity} from './base-entity';

export interface OrderItemEntity extends BaseEntity {
    quantity: number;
    is_done: boolean;
    item_id: number;
    observation: string;
}
