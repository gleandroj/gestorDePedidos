import {BrowserModule} from '@angular/platform-browser';
import {NgModule, ModuleWithProviders} from '@angular/core';

import {ApplicationRoutingModule} from './application-routing.module';
import {SupportModule} from '../support/support.module';
import {CoreModule} from '../core/core.module';

import * as Pages from './pages';
import * as Dialogs from './dialogs';
import * as AppComponents from './components';
import {MaskPipe} from 'ngx-mask';

const PagesComponents = [
    Pages.ItemsPageComponent,
    Pages.CorePageComponent,
    Pages.LoginPageComponent,
    Pages.RegisterPageComponent,
    Pages.ForgetPasswordPageComponent,
    Pages.ResetPasswordPageComponent,
    Pages.ErrorPageComponent,
    Pages.UsersPageComponent,
    Pages.OrdersPageComponent,
    Pages.DashboardPageComponent,
    Pages.ReportItemsPageComponent
];

const DialogComponents = [
    Dialogs.ConfirmDialogComponent,
    Dialogs.UserFormDialogComponent,
    Dialogs.ItemFormDialogComponent,
    Dialogs.OrderFormDialogComponent,
    Dialogs.OrderItemFormDialogComponent,
    Dialogs.CloseOrderFormDialogComponent
];

const Components = [
    ...PagesComponents,
    ...DialogComponents,
    AppComponents.ImgInputComponent,
    AppComponents.TablesComponent,
    AppComponents.TableItemsComponent
];

@NgModule({
    declarations: [
        Components
    ],
    imports: [
        BrowserModule,
        ApplicationRoutingModule,
        SupportModule,
        CoreModule
    ],
    providers: [
        MaskPipe
    ],
    entryComponents: [
        ...DialogComponents
    ]
})
export class ApplicationModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ApplicationModule,
            providers: []
        };
    }
}
