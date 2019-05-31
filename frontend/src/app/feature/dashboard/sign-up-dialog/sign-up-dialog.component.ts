import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
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
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
  }

  onAccept() {
    this.userService.signUp(this.signUpForm.value)
      .subscribe(
        () => {
          this.dialogRef.close();
        },
        (error) => console.log(error)
      );
  }

  onCancel = () => this.dialogRef.close();
}
