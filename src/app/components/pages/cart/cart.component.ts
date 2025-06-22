import { Component, OnInit } from '@angular/core';
import { AppbarComponent } from '../../appbar/appbar.component';
import { UserService } from '../../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SuccessComponent } from '../../success/success.component';
import { CartcardComponent } from '../../cartcard/cartcard.component';
import { CartaddressComponent } from '../../cartaddress/cartaddress.component';
interface Address {
  id: string;
  address: string;
  city: string;
  state: string;
  type: 'Home' | 'Work' | 'Other';
}

@Component({
  selector: 'app-cart',
  imports: [
    AppbarComponent,
    SuccessComponent,
    CommonModule,
    FormsModule,
    CartcardComponent,
    CartaddressComponent,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  issuccess: boolean = false;
  cartItems: any;
  addresses: Address[] = [];
  selectedAddressId: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadCartItems();
    this.loadSelectedAddress();
  }

  // Load previously selected address
  loadSelectedAddress() {
    const savedSelectedAddress = localStorage.getItem('selectedAddressId');
    if (savedSelectedAddress) {
      this.selectedAddressId = savedSelectedAddress;
    }
  }

  // Handle address selection from AddressManagerComponent
  onAddressSelect(addressId: string) {
    this.selectedAddressId = addressId;
    console.log('Address selected in cart:', addressId);
  }

  // Handle addresses change from AddressManagerComponent
  onAddressesChange(addresses: Address[]) {
    this.addresses = addresses;
  }

  // Handle selected address ID change from AddressManagerComponent
  onSelectedAddressChange(selectedAddressId: string | null) {
    this.selectedAddressId = selectedAddressId;
  }

  // Get selected address object
  getSelectedAddress(): Address | null {
    if (!this.selectedAddressId) return null;
    return (
      this.addresses.find((addr) => addr.id === this.selectedAddressId) || null
    );
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
        console.log('getting cart', response);
        if (response && response.result) {
          this.cartItems = response.result;
          console.log('cart items value', this.cartItems);
        } else {
          this.cartItems = [];
        }
      },
      error: (error: any) => {
        console.error('Error loading cart items:', error);
      },
    });
  }

  // Method to use when placing order
  placeOrder() {
    const selectedAddress = this.getSelectedAddress();
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }

    console.log('Placing order with address:', selectedAddress);
    console.log('Selected Address ID:', this.selectedAddressId);

    // Your order placement logic here
    // You can use this.selectedAddressId or selectedAddress object
  }

  onQuantityChange(event: { item: any; action: 'increase' | 'decrease' }) {
    const { item, action } = event;

    if (action === 'increase') {
      // Implement quantity increase logic
      if (!item.quantity) item.quantity = 1;
      item.quantity++;
    } else if (action === 'decrease') {
      // Implement quantity decrease logic
      if (!item.quantity) item.quantity = 1;
      if (item.quantity > 1) {
        item.quantity--;
      }
    }

    // You might want to update the cart in your backend/service here
    // this.userService.updateCartItemQuantity(item.id, item.quantity).subscribe();
  }

  onItemRemove(item: any) {
    if (confirm('Are you sure you want to remove this item from cart?')) {
      // Remove item from cartItems array
      this.cartItems = this.cartItems.filter(
        (cartItem: any) => cartItem.id !== item.id
      );

      // You might want to update the cart in your backend/service here
      // this.userService.removeFromCart(item.id).subscribe();
    }
  }
}
