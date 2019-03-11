import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import * as $ from 'jquery';
import Quill from 'quill';
import ImageResize from 'quill-image-resize-module';

window['$'] = $;
window['jQuery'] = $;

Quill.register('modules/imageResize', ImageResize);

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.log(err));
