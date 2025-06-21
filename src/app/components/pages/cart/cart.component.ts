import { Component, OnInit } from '@angular/core';
import { AppbarComponent } from '../../appbar/appbar.component';
import { UserService } from '../../../services/user/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [AppbarComponent, CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  cartItems: any;

  constructor(private userService: UserService) {}
  ngOnInit() {
    this.loadCartItems();
  }

  loadCartItems() {
    // Get token from localStorage or wherever you store it
    const token = localStorage.getItem('accessToken') || '';

    console.log('token value ', token);
    if (!token) {
      return;
    }
    this.userService.getCartItems(token).subscribe({
      next: (response: any) => {
        // this.loading = false;
        console.log('getting cart', response);
        if (response && response.result) {
          this.cartItems = response.result;
          console.log('cart items value', this.cartItems);
        } else {
          this.cartItems = [];
        }
      },
      error: (error: any) => {
        // this.loading = false;
        // this.error = 'Failed to load cart items. Please try again.';
        console.error('Error loading cart items:', error);
      },
    });
  }
}
