import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from './material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {DieComponent} from './die/die.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  declarations: [
    DieComponent
  ],
  exports: [
    CommonModule,
    DieComponent,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class SharedModule {
}
