import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import * as $ from 'jquery';
import Quill from 'quill';
import ImageResize from 'quill-image-resize-module';
import * as HighCharts from 'highcharts';
import * as moment from 'moment';

declare var require: (filename: string) => any;

window['$'] = $;
window['jQuery'] = $;

Quill.register('modules/imageResize', ImageResize);


require('highcharts/modules/drilldown')(HighCharts);
require('highcharts/modules/exporting')(HighCharts);
require('highcharts/modules/export-data')(HighCharts);
require('highcharts/modules/offline-exporting')(HighCharts);
require('highcharts/modules/no-data-to-display')(HighCharts);
require('highcharts/highcharts-more')(HighCharts);
require('highcharts/modules/solid-gauge')(HighCharts);

const options: any = {
    loading: {
        labelStyle: {
            color: 'black'
        },
        style: {
            backgroundColor: '#FFFFFF',
            opacity: 0.7
        }
    },
    credits: {
        enabled: false
    },
    exporting: {
        enabled: true,
        csv: {
            dateFormat: '%d/%m/%Y %H:%M:%S'
        },
        buttons: {
            contextButton: {
                text: '',
                menuItems: [
                    'downloadJPEG',
                    'downloadPNG',
                    'downloadSVG',
                    'downloadPDF',
                    'downloadCSV',
                    'downloadXLS'
                ]
            }
        }
    },
    lang: {
        contextButtonTitle: 'Opções Avançadas',
        decimalPoint: ',',
        downloadJPEG: 'Salvar como JPEG',
        downloadPDF: 'Salvar como PDF',
        downloadPNG: 'Salvar como PNG',
        downloadSVG: 'Salvar como SVG',
        downloadCSV: 'Salvar como CSV',
        downloadXLS: 'Salvar como Excel',
        loading: 'Aguarde...',
        months: moment.months(),
        noData: 'Nenhum resultado encontrado.',
        printChart: 'Imprimir',
        resetZoom: 'Desfazer zoom',
        resetZoomTitle: 'Voltar zoom 1:1',
        shortMonths: moment.monthsShort(),
        thousandsSep: '.',
        weekdays: moment.weekdays()
    }
};

HighCharts.setOptions(options);

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.log(err));
