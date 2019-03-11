import {Directive, forwardRef, Input} from '@angular/core';
import {Validator, AbstractControl, NG_VALIDATORS} from '@angular/forms';
import {Subscription} from 'rxjs';

@Directive({
    selector: `[appValidateEqual][formControlName],[appValidateEqual]
    [formControl],[appValidateEqual][ngModel]`,
    providers: [
        {provide: NG_VALIDATORS, useExisting: forwardRef(() => EqualValidator), multi: true}
    ]
})
export class EqualValidator implements Validator {
    subscribe: Subscription = null;
    @Input(`appValidateEqual`) validateEqual: string;

    validate(c: AbstractControl): { [key: string]: any } {
        const v = c.value;
        const e = c.root.get(this.validateEqual);
        if (this.subscribe == null) {
            this.subscribe = e.valueChanges.subscribe(() => {
                c.updateValueAndValidity();
            });
        }

        if (e && v !== e.value) {
            return {
                validateEqual: true
            };
        }
        return null;
    }

}
