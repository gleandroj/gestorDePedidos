import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
    CorePageComponent,
    LoginPageComponent,
    ErrorPageComponent,
    UsersPageComponent,
    ForgetPasswordPageComponent,
    ResetPasswordPageComponent,
    MenuPageComponent, OrdersPageComponent,
} from './pages';
import { AuthGuard } from '../core/guards/auth-guard';

const generateBreadTitleForEntity = (prefix, field) => {
    return (params) => {
        return `${params[field]} - ${prefix}`;
    };
};

const routes: Routes = [
    {
        path: 'auth',
        data: {
            breadcrumb: 'Bufallus'
        },
        children: [
            {
                path: 'login',
                component: LoginPageComponent,
                data: {
                    breadcrumb: 'Login'
                }
            },
            {
                path: 'recuperar',
                component: ForgetPasswordPageComponent,
                data: {
                    breadcrumb: 'Recuperar Senha'
                }
            },
            {
                path: 'senha',
                component: ResetPasswordPageComponent,
                data: {
                    breadcrumb: 'Alterar Senha'
                }
            }
        ]
    },
    {
        path: 'bufallus',
        component: CorePageComponent,
        canActivateChild: [AuthGuard],
        data: { breadcrumb: 'Bufallus' },
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'administrar/usuarios'
            },
            {
                path: 'administrar',
                children: [
                    {
                        path: 'usuarios',
                        component: UsersPageComponent,
                        data: {
                            authorization: [
                                'administrator'
                            ],
                            breadcrumb: 'Gerenciar Usuários'
                        }
                    },
                    {
                        path: 'cardapio',
                        component: MenuPageComponent,
                        data: {
                            authorization: [
                                'administrator'
                            ],
                            breadcrumb: 'Gerenciar Cardápio'
                        }
                    },
                    {
                        path: 'pedidos',
                        component: OrdersPageComponent,
                        data: {
                            authorization: [
                                'administrator'
                            ],
                            breadcrumb: 'Gerenciar Pedidos'
                        }
                    }
                ]
            },
            {
                path: '**',
                component: ErrorPageComponent,
                pathMatch: 'full',
                data: {
                    breadcrumb: 'Página não encontrada'
                }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ApplicationRoutingModule {
}
