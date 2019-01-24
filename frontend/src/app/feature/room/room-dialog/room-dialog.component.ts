import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'room-dialog',
  templateUrl: './room-dialog.component.html',
  styleUrls: ['./room-dialog.component.scss']
})
export class RoomDialogComponent {
  name: string;

  constructor(public dialogRef: MatDialogRef<RoomDialogComponent>) {}

  onAccept = () => this.dialogRef.close(this.name);
  onNoClick = () => this.dialogRef.close();
}
