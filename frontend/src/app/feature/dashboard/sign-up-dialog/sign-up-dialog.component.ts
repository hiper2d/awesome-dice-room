import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher, MatDialogRef} from '@angular/material';

/** Error when invalid control is dirty, touched, or submitted. */
export class EmailErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-register-dialog',
  templateUrl: './sign-up-dialog.component.html',
  styleUrls: ['./sign-up-dialog.component.scss']
})
export class SignUpDialogComponent implements OnInit {

  signUpForm: FormGroup;
  matcher = new EmailErrorStateMatcher();

  constructor(
    fb: FormBuilder,
    private dialogRef: MatDialogRef<void>
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
    this.dialogRef.close(this.signUpForm.value);
  }

  onCancel = () => this.dialogRef.close();
}
