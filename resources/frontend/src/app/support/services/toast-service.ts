import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';

@Injectable()
export class ToastService {

    public readonly config: MatSnackBarConfig = {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
    };

    constructor(private matSnackBar: MatSnackBar) {
    }

    open(message, action?: string) {
        return this.matSnackBar.open(
            message,
            action,
            this.config
        );
    }
}
