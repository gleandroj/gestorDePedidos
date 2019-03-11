import {Component, ElementRef, forwardRef, Input, TemplateRef, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

export const VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ImgInputComponent),
    multi: true,
};

@Component({
    selector: 'app-img-input',
    templateUrl: './img-input.component.html',
    styleUrls: [
        './img-input.component.less'
    ],
    providers: [VALUE_ACCESSOR]
})
export class ImgInputComponent implements ControlValueAccessor {

    @Input() public label = '';
    @Input() public isDisabled: boolean;

    public fallbackImage = '/dist/assets/img/avatars/avatar1.jpg';
    public imageUploadData: string = null;

    @ViewChild('imgFileInput')
    public imgFileInput: ElementRef<HTMLInputElement>;
    public onTouched: any;
    public onChange: any;

    constructor() {
    }

    get imageSrc() {
        if (this.imageUploadData != null) {
            return this.imageUploadData;
        }
        return this.fallbackImage;
    }

    removeImage() {
        this.imageUploadData = this.imgFileInput.nativeElement.value = null;
    }

    previewImage($event) {
        this.readImage($event, (result) => {
            this.onChange(this.imageUploadData = result);
        });
    }

    readImage($event, doneCallback) {
        const imgFile = $event.target.files[0],
            reader = new FileReader();

        reader.onloadend = function () {
            doneCallback(reader.result);
        };

        reader.readAsDataURL(imgFile);
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
        if (this.onTouched) {
            this.onTouched();
        }
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }

    writeValue(obj: any): void {
        this.imageUploadData = obj;
    }
}
