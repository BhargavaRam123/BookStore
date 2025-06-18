import { Component, model } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  selectedComponent = model('login');
  constructor(
    private fb: FormBuilder,
    private userservice: UserService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
    console.log('model value is ', this.selectedComponent());
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
  clickfunc() {
    console.log('click called');
    this.selectedComponent.set('signup');
  }
  onSubmit() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      this.userservice.logIn(formData).subscribe({
        next: (response: any) => {
          console.log('Login successful:', response);
          localStorage.setItem('accessToken', response.result.accessToken);
          this.router.navigate(['home']);
          // Handle successful login (e.g., redirect, store token, etc.)
        },
        error: (error) => {
          console.error('Login failed:', error);
          // Handle login error (e.g., show error message)
        },
      });
    } else {
      // Mark all fields as touched to show validation errors
      this.loginForm.markAllAsTouched();
      console.log('Form is invalid');
    }
  }
}
