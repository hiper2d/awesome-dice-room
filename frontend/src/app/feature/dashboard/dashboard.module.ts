import {NgModule} from '@angular/core';

import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardComponent} from './dashboard.component';
import {SharedModule} from '../../shared/shared.module';
import {CreateRoomDialogComponent} from './create-room-dialog/create-room-dialog.component';

@NgModule({
  declarations: [
    DashboardComponent,
    CreateRoomDialogComponent
  ],
  imports: [
    SharedModule,
    DashboardRoutingModule
  ],
  entryComponents: [
    CreateRoomDialogComponent
  ]
})
export class DashboardModule { }
