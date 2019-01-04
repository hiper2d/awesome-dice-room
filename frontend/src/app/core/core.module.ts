import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PageNotFoundComponent} from '../page-not-found/page-not-found.component';
import {WebSocketService} from './service/websocket.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [],
  providers: [
    WebSocketService
  ]
})
export class CoreModule { }
