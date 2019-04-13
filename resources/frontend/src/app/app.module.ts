import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SupportModule } from './support/support.module';
import { CoreModule } from './core/core.module';
import { ApplicationModule } from './application/application.module';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from '../environments/environment';

registerLocaleData(localePt);

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        SupportModule.forRoot(),
        CoreModule.forRoot(),
        ApplicationModule.forRoot(),
        environment.production ? ServiceWorkerModule.register("ngsw-worker.js") : []
    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'pt-BR' }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
