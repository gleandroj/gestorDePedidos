import {Component, OnInit, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: 'confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.less']
})
export class ConfirmDialogComponent implements OnInit {
    public message = 'Tem certeza?';

    constructor(@Inject(MAT_DIALOG_DATA) public data) {
        this.message = data.message || 'Tem certeza?';
    }

    ngOnInit() {
    }

}
