import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
import {Room} from '../../../model/room';
import {UserService} from '../../../core/service/user.service';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['/login-dialog.component.scss']
})
export class LoginDialogComponent {

  loginForm: FormGroup;

  constructor(
    fb: FormBuilder,
    private dialogRef: MatDialogRef<void>,
    private userService: UserService
  ) {
    this.loginForm = fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onAccept() {
    this.userService.login(this.loginForm.value)
      .subscribe(() => this.dialogRef.close());
  }

  onCancel = () => this.dialogRef.close();
}
