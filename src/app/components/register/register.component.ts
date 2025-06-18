import { Component, model } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user/user.service';
@Component({
  selector: 'app-register',
  imports: [
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  signUpForm: FormGroup;
  isSubmitting: any;
  selectedComponent = model('login');
  constructor(private fb: FormBuilder, private userservice: UserService) {
    this.signUpForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
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
  clickfunc() {
    console.log('click called');
    this.selectedComponent.set('login');
  }
  onSubmit() {
    // Check if form is valid
    if (this.signUpForm.valid) {
      // Get form data
      const formData = this.signUpForm.value;
      console.log('form data value', formData);
      // Call the service
      this.userservice.signUp(formData).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          // Navigate to login or show success message
          // this.selectedComponent.set('login');
        },
        error: (error) => {
          console.error('Registration failed:', error);
          // Handle error (show error message to user)
        },
      });
    } else {
      // Mark all fields as touched to show validation errors
      this.signUpForm.markAllAsTouched();
      console.log('Form is invalid');
    }
  }
}
