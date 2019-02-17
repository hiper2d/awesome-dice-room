import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {Room} from '../../../model/room';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'create-room-dialog',
  templateUrl: './create-room-dialog.component.html',
  styleUrls: ['./create-room-dialog.component.scss']
})
export class CreateRoomDialogComponent {

  roomForm: FormGroup;

  constructor(
    fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateRoomDialogComponent>
  ) {
    this.roomForm = fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  onAccept() {
    const room = this.roomForm.value as Room;
    console.log(room);
    this.dialogRef.close(new Room(null, room.name, room.description));
  }

  onCancel = () => this.dialogRef.close();
}
