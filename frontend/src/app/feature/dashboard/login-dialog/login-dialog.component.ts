import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
import {Room} from '../../../model/room';

@Component({
  selector: 'login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['/login-dialog.component.scss']
})
export class LoginDialogComponent {

  loginForm: FormGroup;

  constructor(
    fb: FormBuilder,
    private dialogRef: MatDialogRef<void>
  ) {
    this.loginForm = fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onAccept() {
    this.dialogRef.close(this.loginForm.value);
  }

  onCancel = () => this.dialogRef.close();
}
