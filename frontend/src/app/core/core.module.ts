import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from './interceptor/auth.interceptor';

const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];

@NgModule({
  imports: [
    CommonModule
  ],
  providers: httpInterceptorProviders
})
export class CoreModule { }
