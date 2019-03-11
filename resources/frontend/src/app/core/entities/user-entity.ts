import { BaseEntity } from './base-entity';

export const genders = {
    M: 'Masculino',
    F: 'Feminino'
};

export const roles = {
    administrator: 'Administrador',
    auxiliary: 'Auxiliar'
};

export interface UserEntity extends BaseEntity {
    name: string;
    email: string;
    gender: string;
    role: string;
    birthday: string;
    cellphone: string;
    password?: string;
    password_confirmation?: string;
}
