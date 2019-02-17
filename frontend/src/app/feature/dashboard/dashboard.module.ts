import {NgModule} from '@angular/core';

import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardComponent} from './dashboard.component';
import {SharedModule} from '../../shared/shared.module';
import {CreateRoomDialogComponent} from './create-room-dialog/create-room-dialog.component';
import {LoginDialogComponent} from './login-dialog/login-dialog.component';
import { SignUpDialogComponent } from './sign-up-dialog/sign-up-dialog.component';

@NgModule({
  declarations: [
    CreateRoomDialogComponent,
    DashboardComponent,
    LoginDialogComponent,
    SignUpDialogComponent
  ],
  imports: [
    SharedModule,
    DashboardRoutingModule
  ],
  entryComponents: [
    CreateRoomDialogComponent,
    LoginDialogComponent,
    SignUpDialogComponent
  ]
})
export class DashboardModule { }
