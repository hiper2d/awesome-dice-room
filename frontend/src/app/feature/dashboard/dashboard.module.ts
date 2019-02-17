import {NgModule} from '@angular/core';

import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardComponent} from './dashboard.component';
import {SharedModule} from '../../shared/shared.module';
import {NewRoomDialogComponent} from './new-room-dialog/new-room-dialog.component';
import {LoginDialogComponent} from './login-dialog/login-dialog.component';
import { SignUpDialogComponent } from './sign-up-dialog/sign-up-dialog.component';

@NgModule({
  declarations: [
    NewRoomDialogComponent,
    DashboardComponent,
    LoginDialogComponent,
    SignUpDialogComponent
  ],
  imports: [
    SharedModule,
    DashboardRoutingModule
  ],
  entryComponents: [
    NewRoomDialogComponent,
    LoginDialogComponent,
    SignUpDialogComponent
  ]
})
export class DashboardModule { }
