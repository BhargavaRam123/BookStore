import { Component } from '@angular/core';
import { AppbarComponent } from '../../appbar/appbar.component';
import { InputComponent } from '../../input/input.component';
@Component({
  selector: 'app-user-profile',
  imports: [AppbarComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent {}
