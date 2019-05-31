import {Component} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {Room} from '../../../model/room';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'new-room-dialog',
  templateUrl: './new-room-dialog.component.html',
  styleUrls: ['./new-room-dialog.component.scss']
})
export class NewRoomDialogComponent {

  roomForm: FormGroup;

  constructor(
    fb: FormBuilder,
    private dialogRef: MatDialogRef<NewRoomDialogComponent>
  ) {
    this.roomForm = fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  onAccept() {
    const room = this.roomForm.value as Room;
    this.dialogRef.close(new Room(null, room.name, room.description));
  }

  onCancel = () => this.dialogRef.close();
}
