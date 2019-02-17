import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {XhrInterceptor} from './interceptor/xhr.interceptor';

const httpInterceptorProviders = [
  {provide: HTTP_INTERCEPTORS, useClass: XhrInterceptor, multi: true},
];

@NgModule({
  imports: [
    CommonModule
  ]
})
export class CoreModule { }
