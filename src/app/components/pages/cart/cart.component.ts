import { Component, OnInit } from '@angular/core';
import { AppbarComponent } from '../../appbar/appbar.component';
import { UserService } from '../../../services/user/user.service';
import { NotesService } from '../../../services/notes/notes.service'; // Add this import
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
  stage: any = 1;
  isPlacingOrder: boolean = false; // Add loading state

  constructor(
    private userService: UserService,
    private notesService: NotesService // Add NotesService
  ) {}

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

  changeStage() {
    this.stage++;
  }

  // Handle stage change from child components
  onStageChange() {
    this.changeStage();
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

  // Updated method to place order using the API
  placeOrder() {
    const selectedAddress = this.getSelectedAddress();
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }

    if (!this.cartItems || this.cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    this.isPlacingOrder = true;

    // Transform cart items to match API format
    const orderData = {
      orders: this.cartItems.map((item: any) => ({
        product_id: item.product_id.id || item.product_id._id,
        product_name:
          item.product_id.bookName ||
          item.product_id.title ||
          'Unknown Product',
        product_quantity: item.quantityToBuy || 1,
        product_price:
          item.product_id.discountPrice || item.product_id.price || 0,
      })),
    };

    console.log('Placing order with data:', orderData);
    console.log('Selected Address:', selectedAddress);

    this.notesService.placeOrder(orderData).subscribe({
      next: (response: any) => {
        console.log('Order placed successfully:', response);
        this.isPlacingOrder = false;
        this.issuccess = true;
        this.stage = 'success';
      },
      error: (error: any) => {
        console.error('Error placing order:', error);
        this.isPlacingOrder = false;
        alert('Failed to place order. Please try again.');
      },
    });
  }

  onQuantityChange(event: { item: any; action: 'increase' | 'decrease' }) {
    const { item, action } = event;

    if (action === 'increase') {
      // Implement quantity increase logic
      if (!item.quantityToBuy) item.quantityToBuy = 1;
      item.quantityToBuy++;
    } else if (action === 'decrease') {
      // Implement quantity decrease logic
      if (!item.quantityToBuy) item.quantityToBuy = 1;
      if (item.quantityToBuy > 1) {
        item.quantityToBuy--;
      }
    }

    // You might want to update the cart in your backend/service here
    // this.userService.updateCartItemQuantity(item.id, item.quantityToBuy).subscribe();
  }

  onItemRemove(item: any) {
    if (confirm('Are you sure you want to remove this item from cart?')) {
      // Remove item from cartItems array
      this.cartItems = this.cartItems.filter(
        (cartItem: any) => cartItem._id !== item._id
      );

      // You might want to update the cart in your backend/service here
      // this.userService.removeFromCart(item._id).subscribe();
    }
  }

  // Helper method to calculate total price
  getTotalPrice(): number {
    if (!this.cartItems || this.cartItems.length === 0) return 0;

    return this.cartItems.reduce((total: number, item: any) => {
      const price = item.product_id.discountPrice || item.product_id.price || 0;
      const quantity = item.quantityToBuy || 1;
      return total + price * quantity;
    }, 0);
  }

  // Helper method to get total items count
  getTotalItems(): number {
    if (!this.cartItems || this.cartItems.length === 0) return 0;

    return this.cartItems.reduce((total: number, item: any) => {
      return total + (item.quantityToBuy || 1);
    }, 0);
  }
}
