import {BaseEntity} from './base-entity';

export interface OrderItemEntity extends BaseEntity {
    quantity: number;
    is_done: boolean;
    item_id: number;
    price: number;
    cost: number;
    discount: number;
    observation: string;
    finalized_at: string;
    parent_id: number;
    children?: OrderItemEntity[];
}
