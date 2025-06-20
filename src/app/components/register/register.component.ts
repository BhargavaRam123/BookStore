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

  // Method to store user data in localStorage
  private storeUserDataInLocalStorage(userData: any, response: any) {
    try {
      // Create user data object to store
      const userDataToStore = {
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password, // Note: storing passwords in localStorage is not recommended for security
        phone: userData.phone,
        // You can also store additional data from the response if needed
        userId: response.result?._id,
        isVerified: response.result?.isVerified,
        createdAt: response.result?.createdAt,
      };

      // Store individual items
      localStorage.setItem('userFullName', userData.fullName);
      localStorage.setItem('userEmail', userData.email);
      localStorage.setItem('userPassword', userData.password);
      localStorage.setItem('userPhone', userData.phone);

      // Or store as a single JSON object
      localStorage.setItem('userData', JSON.stringify(userDataToStore));

      console.log('User data stored in localStorage successfully');
    } catch (error) {
      console.error('Error storing data in localStorage:', error);
    }
  }

  onSubmit() {
    // Check if form is valid
    if (this.signUpForm.valid) {
      // Get form data
      const formData = this.signUpForm.value;
      console.log('form data value', formData);

      this.isSubmitting = true; // Set loading state

      // Call the service
      this.userservice.signUp(formData).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);

          // Store user data in localStorage
          this.storeUserDataInLocalStorage(formData, response);

          this.isSubmitting = false;

          // Navigate to login or show success message
          // this.selectedComponent.set('login');
        },
        error: (error) => {
          console.error('Registration failed:', error);
          this.isSubmitting = false;
          // Handle error (show error message to user)
        },
      });
    } else {
      // Mark all fields as touched to show validation errors
      this.signUpForm.markAllAsTouched();
      console.log('Form is invalid');
    }
  }

  // Helper method to retrieve user data from localStorage
  getUserDataFromLocalStorage() {
    try {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error retrieving data from localStorage:', error);
      return null;
    }
  }

  // Helper method to clear user data from localStorage
  clearUserDataFromLocalStorage() {
    try {
      localStorage.removeItem('userFullName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userPassword');
      localStorage.removeItem('userPhone');
      localStorage.removeItem('userData');
      console.log('User data cleared from localStorage');
    } catch (error) {
      console.error('Error clearing data from localStorage:', error);
    }
  }
}
