import {NgModule} from '@angular/core';
import {MatButtonModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatInputModule, MatTabsModule} from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatTabsModule
  ],
  declarations: [
  ],
  exports: [
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatTabsModule
  ]
})
export class MaterialModule {
}
