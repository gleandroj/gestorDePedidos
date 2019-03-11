import {Directive, forwardRef} from '@angular/core';
import {Validator, AbstractControl, NG_VALIDATORS} from '@angular/forms';
import {Subscription} from 'rxjs';
import * as moment from 'moment';

@Directive({
    selector: `[appDateValidator][formControlName],[appDateValidator]
    [formControl],[appDateValidator][ngModel]`,
    providers: [
        {provide: NG_VALIDATORS, useExisting: forwardRef(() => DateValidator), multi: true}
    ]
})
export class DateValidator implements Validator {
    subscribe: Subscription = null;

    validate(c: AbstractControl): { [key: string]: any } {

        if (moment(c.value, 'DD/MM/YYYY').isValid()) {
            return {};
        }

        return {
            pattern: true
        };
    }

}
