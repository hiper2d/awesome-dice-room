import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {Room} from '../../../model/room';

@Component({
  selector: 'dashboard-dialog',
  templateUrl: './dashboard-dialog.component.html',
  styleUrls: ['./dashboard-dialog.component.scss']
})
export class DashboardDialogComponent {
  name: string;
  description: string;

  constructor(
    private dialogRef: MatDialogRef<DashboardDialogComponent>
  ) {}

  onAccept = () => this.dialogRef.close(new Room(null, this.name, this.description));
  onNoClick = () => this.dialogRef.close();
}