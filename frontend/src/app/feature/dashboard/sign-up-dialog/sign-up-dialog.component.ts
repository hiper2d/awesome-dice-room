import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher, MatDialogRef} from '@angular/material';
import {UserService} from '../../../core/service/user.service';

class EmailErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'sign-up-dialog',
  templateUrl: './sign-up-dialog.component.html',
  styleUrls: ['./sign-up-dialog.component.scss']
})
export class SignUpDialogComponent implements OnInit {

  signUpForm: FormGroup;
  matcher = new EmailErrorStateMatcher();

  constructor(
    fb: FormBuilder,
    private dialogRef: MatDialogRef<void>,
    private userService: UserService
  ) {
    this.signUpForm = fb.group({
      username: ['', Validators.required],
      email: new FormControl('', [Validators.required, Validators.email]),
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  onAccept() {
    this.userService.signUp(this.signUpForm.value)
      .subscribe(() => this.dialogRef.close());
  }

  onCancel = () => this.dialogRef.close();
}