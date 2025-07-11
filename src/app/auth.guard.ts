// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    // Check if user is logged in (simple token check)
    const token = localStorage.getItem('accessToken');

    if (token) {
      return true; // Allow access
    }

    // Redirect to login if no token
    this.router.navigate(['/home']);
    return false;
  }
}
