import { BaseEntity } from './base-entity';

export interface ItemEntity extends BaseEntity {
    description: string;
    price: number;
    cost: number;
}
