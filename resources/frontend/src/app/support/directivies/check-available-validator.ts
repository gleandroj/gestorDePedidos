import {Directive, forwardRef, Input} from '@angular/core';
import {Validator, AbstractControl, NG_ASYNC_VALIDATORS} from '@angular/forms';
import {of} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';

@Directive({
    selector: `[appCheckAvailable][formControlName],[appCheckAvailable][formControl],[appCheckAvailable][ngModel]`,
    providers: [
        {
            provide: NG_ASYNC_VALIDATORS,
            useExisting: forwardRef(() => CheckAvailableValidator),
            multi: true
        }
    ]
})
export class CheckAvailableValidator implements Validator {
    @Input() appCheckAvailable: string;
    @Input() ignoreId: any = null;
    @Input() parent: any = null;
    @Input() public apiUrl: string;
    @Input() public field = 'data';
    private timeout = null;

    constructor(protected http: HttpClient) {
    }

    public validate(c: AbstractControl): { [key: string]: any } {
        const value = c.value;
        if (value && c.dirty) {
            clearTimeout(this.timeout);
            return new Promise((resolve, reject) => {
                this.timeout = setTimeout(() => {
                    const postData: { [key: string]: any } = {};
                    postData[this.field] = value;
                    postData['ignoreId'] = this.ignoreId;
                    this.http.post(this.apiUrl, postData).pipe(
                        catchError((err: HttpErrorResponse) => {
                            return of({});
                        }),
                        map((data: any) => {
                            return !!!data.available ? {
                                appCheckAvailable: true
                            } : {};
                        })
                    ).subscribe((data) => resolve(data));
                }, 600);
            });
        }
        return of({});
    }
}
