import {NgModule} from '@angular/core';
import {MatButtonModule, MatCheckboxModule, MatDialogModule, MatInputModule, MatTabsModule} from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatInputModule,
    MatTabsModule
  ],
  declarations: [
  ],
  exports: [
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatInputModule,
    MatTabsModule
  ]
})
export class MaterialModule {
}
