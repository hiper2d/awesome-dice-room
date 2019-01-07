import {ControlValueAccessor} from '@angular/forms';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DieModel} from '../../model/die.model';

@Component({
    selector: 'app-die',
    templateUrl: './die.component.html',
    styleUrls: ['./die.component.scss']
})
export class DieComponent implements ControlValueAccessor {

    @Input()
    dieModel: DieModel;

    @Output()
    select = new EventEmitter<DieModel>();

    registerOnChange(fn: any): void {
    }

    registerOnTouched(fn: any): void {
    }

    setDisabledState(isDisabled: boolean): void {
    }

    writeValue(obj: any): void {
    }

    onClick() {
        this.select.emit(this.dieModel);
    }
}
