import {NgModule} from '@angular/core';
import {RoomRoutingModule} from './room-routing.module';
import {RoomComponent} from './room.component';
import {SharedModule} from '../../shared/shared.module';
import {PlayerSeatComponent} from './player-seat/player-seat.component';
import {RoomMessageComponent} from './room-message/room-message.component';
import {PlayerInventoryComponent} from './player-seat/player-inventory/player-inventory.component';

@NgModule({
  declarations: [
    PlayerSeatComponent,
    RoomComponent,
    PlayerSeatComponent,
    RoomMessageComponent,
    PlayerInventoryComponent
  ],
  imports: [
    SharedModule,
    RoomRoutingModule
  ]
})
export class RoomModule { }
