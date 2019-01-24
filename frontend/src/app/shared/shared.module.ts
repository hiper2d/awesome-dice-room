import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from './material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DieComponent} from './die/die.component';
import {AutofocusDirective} from './directive/autofocus.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  declarations: [
    DieComponent,
    AutofocusDirective
  ],
  exports: [
    CommonModule,
    DieComponent,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    AutofocusDirective
  ]
})
export class SharedModule {
}
