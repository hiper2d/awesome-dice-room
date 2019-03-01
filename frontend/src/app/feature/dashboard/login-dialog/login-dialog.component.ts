import {Component} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ValidatorFn, Validators} from '@angular/forms';
import {ErrorStateMatcher, MatDialogRef} from '@angular/material';
import {UserService} from '../../../core/service/user.service';

class UsernameErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['/login-dialog.component.scss']
})
export class LoginDialogComponent {

  loginForm: FormGroup;
  matcher = new UsernameErrorStateMatcher();
  invalidUsernameOrPassword = false;

  constructor(
    fb: FormBuilder,
    private dialogRef: MatDialogRef<void>,
    private userService: UserService
  ) {
    this.loginForm = fb.group({
      username: ['', [Validators.required, this.userAlreadyExistsValidator()]],
      password: ['', Validators.required]
    });
  }

  private userAlreadyExistsValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      return this.invalidUsernameOrPassword ? {'invalid': {value: control.value}} : null;
    };
  }

  onKeyDown() {
    this.invalidUsernameOrPassword = false;
  }

  onAccept() {
    this.invalidUsernameOrPassword = false;
    this.userService.getAuthToken(this.loginForm.value)
      .subscribe(
        () => {
          this.dialogRef.close();
        },
        () => {
          this.invalidUsernameOrPassword = true;
          this.loginForm.get('username').updateValueAndValidity();
        });
  }

  onCancel = () => this.dialogRef.close();
}
