import { Component, OnInit } from '@angular/core';
import { AppbarComponent } from '../../appbar/appbar.component';
import { InputComponent } from '../../input/input.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  imports: [AppbarComponent, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  userFullName: string = '';
  userEmail: string = '';
  userPassword: string = '';
  userPhone: string = '';

  editableFields = {
    fullName: false,
    email: false,
    password: false,
    phone: false,
  };

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    // Retrieve data from localStorage
    this.userFullName = localStorage.getItem('userFullName') || '';
    this.userEmail = localStorage.getItem('userEmail') || '';
    this.userPassword = localStorage.getItem('userPassword') || '';
    this.userPhone = localStorage.getItem('userPhone') || '';
  }

  makeFieldEditable(field: string) {
    this.editableFields[field as keyof typeof this.editableFields] = true;
  }

  onFieldBlur(field: string) {
    this.editableFields[field as keyof typeof this.editableFields] = false;
    this.saveFieldToLocalStorage(field);
  }

  saveFieldToLocalStorage(field: string) {
    switch (field) {
      case 'fullName':
        localStorage.setItem('userFullName', this.userFullName);
        break;
      case 'email':
        localStorage.setItem('userEmail', this.userEmail);
        break;
      case 'password':
        localStorage.setItem('userPassword', this.userPassword);
        break;
      case 'phone':
        localStorage.setItem('userPhone', this.userPhone);
        break;
    }
  }
}
