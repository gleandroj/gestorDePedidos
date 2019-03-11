import {NgModule, Provider} from '@angular/core';
import {ModuleWithProviders} from '@angular/core';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {SupportModule} from '../support/support.module';
import {Interceptor} from './http/interceptor';

const Services: Provider[] = [
    {
        provide: HTTP_INTERCEPTORS,
        useClass: Interceptor,
        multi: true
    }
];

const components = [];

/**
 * Contem Serviços e Entidades genéricas Reutilizáveis
 */
@NgModule({
    imports: [
        SupportModule,
    ],
    exports: [
        SupportModule,
        components
    ],
    declarations: [
        components
    ],
    entryComponents: []
})
export class CoreModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: CoreModule,
            providers: Services
        };
    }
}
