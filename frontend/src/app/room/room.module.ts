import {NgModule} from '@angular/core';

import {RoomRoutingModule} from './room-routing.module';
import {RoomComponent} from './room.component';
import {SharedModule} from '../shared/shared.module';
import { RoomDialogComponent } from './room-dialog/room-dialog.component';

@NgModule({
  declarations: [RoomComponent, RoomDialogComponent],
  imports: [
    SharedModule,
    RoomRoutingModule
  ],
  entryComponents: [
    RoomDialogComponent
  ]
})
export class RoomModule { }
