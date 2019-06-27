import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModuleWithProviders} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {NgxMaskModule} from 'ngx-mask';
import {Ng2Webstorage} from 'ngx-webstorage';

import {FlexLayoutModule} from '@angular/flex-layout';

import * as Directives from './directivies';
import * as Pipes from './pipes';

import {
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatSortModule,
    MatInputModule,
    MatRadioModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatStepperModule,
    MatListModule, MatDatepickerModule, MatNativeDateModule
} from '@angular/material';

import {QuillModule} from 'ngx-quill';
import {BreadcrumbService, ToastService} from './services';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';

const materialModules = [
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatSortModule,
    MatInputModule,
    MatRadioModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    MatListModule,
    NgxMatSelectSearchModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatStepperModule
];

const exportShared = [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    BrowserAnimationsModule,
    NgxMaskModule,
    Ng2Webstorage,
    ...materialModules,
    QuillModule,
    FlexLayoutModule,
    DragDropModule
];

const importShared = [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    BrowserAnimationsModule,
    ...materialModules,
    FlexLayoutModule,
    QuillModule,
    DragDropModule,
    NgxMaskModule.forRoot(),
    Ng2Webstorage.forRoot({prefix: 'Bufallus'})
];

const declarations = [
    Directives.EqualValidator,
    Directives.CheckAvailableValidator,
    Directives.DateValidator,
    Directives.LongPressDirective,
    Pipes.Safe
];

const entryComponents = [];

/**
 * Contém a base para todos os módulos
 */
@NgModule({
    imports: [
        ...importShared
    ],
    exports: [
        ...exportShared,
        ...declarations
    ],
    declarations: [
        ...declarations
    ],
    entryComponents: [
        ...entryComponents
    ]
})
export class SupportModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SupportModule,
            providers: [
                {provide: ToastService, useClass: ToastService},
                {provide: BreadcrumbService, useClass: BreadcrumbService},
            ]
        };
    }

}
