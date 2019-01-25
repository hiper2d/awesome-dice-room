import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {RoomDialogInput} from '../../../model/room-dialog-input';
import {RoomDialogOutput} from '../../../model/room-dialog-output';

@Component({
  selector: 'room-dialog',
  templateUrl: './room-dialog.component.html',
  styleUrls: ['./room-dialog.component.scss']
})
export class RoomDialogComponent {
  name: string;

  constructor(
    public dialogRef: MatDialogRef<RoomDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RoomDialogInput
  ) {}

  onAccept = () => this.dialogRef.close(new RoomDialogOutput(this.name, this.data.roomId));
  onNoClick = () => this.dialogRef.close();
}
