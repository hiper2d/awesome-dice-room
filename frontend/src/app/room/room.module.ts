import {NgModule} from '@angular/core';

import {RoomRoutingModule} from './room-routing.module';
import {RoomComponent} from './room.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [RoomComponent],
  imports: [
    SharedModule,
    RoomRoutingModule
  ]
})
export class RoomModule { }
