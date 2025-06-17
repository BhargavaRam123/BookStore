import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { SignupComponent } from './components/pages/signup/signup.component';

export const routes: Routes = [
  { path: 'home', component: AppComponent },
  { path: 'signin', component: SignupComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
