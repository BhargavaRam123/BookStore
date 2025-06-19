import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { SignupComponent } from './components/pages/signup/signup.component';
import { HomeComponent } from './components/pages/home/home.component';
export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'signin', component: SignupComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
