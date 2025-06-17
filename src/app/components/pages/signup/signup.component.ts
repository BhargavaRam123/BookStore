import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormGroupDirective,
  NgForm,
} from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  loginForm: FormGroup;
  signUpForm: FormGroup;
  flag = false;

  toggleValue = 'login';
  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
    this.signUpForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      mobileNumber: ['', [Validators.required, Validators.minLength(10)]],
    });
  }
  getErrorMessage(formGroup: FormGroup, controlName: string): string {
    const control = formGroup.get(controlName);
    if (!control) return '';

    if (control.hasError('required')) {
      return `${
        controlName.charAt(0).toUpperCase() + controlName.slice(1)
      } is required`;
    }
    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength'].requiredLength;
      return `Minimum ${requiredLength} characters required`;
    }
    return '';
  }
  toggleFunction() {
    if (this.toggleValue === 'login') {
      this.toggleValue = 'signup';
    } else {
      this.toggleValue = 'login';
    }
  }
}
