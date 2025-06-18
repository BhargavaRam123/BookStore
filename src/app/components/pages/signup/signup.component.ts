import { Component, signal } from '@angular/core';
import { LoginComponent } from '../../login/login.component';
import { RegisterComponent } from '../../register/register.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-signup',
  imports: [LoginComponent, RegisterComponent, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  flag = false;
  selectedComponent = signal('login');
  constructor() {}
}
