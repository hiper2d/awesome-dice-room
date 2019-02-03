import {NgModule} from '@angular/core';

import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardComponent} from './dashboard.component';
import {SharedModule} from '../../shared/shared.module';
import {DashboardDialogComponent} from './dashboard-dialog/dashboard-dialog.component';

@NgModule({
  declarations: [DashboardComponent, DashboardDialogComponent],
  imports: [
    SharedModule,
    DashboardRoutingModule
  ],
  entryComponents: [
    DashboardDialogComponent
  ]
})
export class DashboardModule { }
