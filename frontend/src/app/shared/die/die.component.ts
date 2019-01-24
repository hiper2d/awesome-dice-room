import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Die} from '../../model/die';
import {Subscription} from 'rxjs';

@Component({
  selector: 'die',
  templateUrl: './die.component.html',
  styleUrls: ['./die.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: DieComponent,
    multi: true
  }]
})
export class DieComponent implements OnInit, OnDestroy, ControlValueAccessor {

  die: Die;
  checkboxControl = new FormControl(false);

  private sbscr: Subscription;
  private onChange: any = () => {};
  private onTouched: any = () => {};

  ngOnInit(): void {
    this.sbscr = this.checkboxControl.valueChanges.subscribe(val => {
      this.die.selected = val;
      this.onChange(this.die);
    });
  }

  ngOnDestroy(): void {
    this.sbscr.unsubscribe();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(obj: Die): void {
    if (obj) {
      this.die = obj;
      this.checkboxControl.setValue(obj.selected, {emitEvent: false});
    }
  }
}
