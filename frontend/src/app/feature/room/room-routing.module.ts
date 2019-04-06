import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoomComponent} from './room.component';
import {RoomEnteringGuard} from '../../core/guard/room-entering.guard';

const routes: Routes = [
  { path: 'room/:roomId', canActivate: [ RoomEnteringGuard ], component: RoomComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomRoutingModule { }
