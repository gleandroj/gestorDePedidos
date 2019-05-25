import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {
    CorePageComponent,
    LoginPageComponent,
    ErrorPageComponent,
    UsersPageComponent,
    ForgetPasswordPageComponent,
    ResetPasswordPageComponent,
    ItemsPageComponent, OrdersPageComponent, DashboardPageComponent, ReportItemsPageComponent,
} from './pages';
import {AuthGuard} from '../core/guards/auth-guard';

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
        data: {breadcrumb: 'Bufallus'},
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'dashboard'
            },
            {
                path: 'dashboard',
                component: DashboardPageComponent,
                data: {
                    breadcrumb: 'Dashboard'
                }
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
                        component: ItemsPageComponent,
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
                path: 'relatorios',
                children: [
                    {
                        path: 'cardapio',
                        component: ReportItemsPageComponent,
                        data: {
                            authorization: [
                                'administrator'
                            ],
                            breadcrumb: 'Relatório de Itens'
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
