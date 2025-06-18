import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../../login/login.component';
@Component({
  selector: 'app-signup',
  imports: [
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    LoginComponent,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  signUpForm: FormGroup;
  flag = false;

  toggleValue = 'login';
  constructor(private fb: FormBuilder) {
    this.signUpForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      mobileNumber: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  toggleFunction() {
    if (this.toggleValue === 'login') {
      this.toggleValue = 'signup';
    } else {
      this.toggleValue = 'login';
    }
  }
}
