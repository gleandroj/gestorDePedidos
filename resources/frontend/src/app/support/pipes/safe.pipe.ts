import {DomSanitizer} from '@angular/platform-browser';
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'safeHtml'})
export class Safe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {
    }

    transform(value: any, ...args: any[]) {
        return this.sanitizer.bypassSecurityTrustHtml(value);
    }
}
