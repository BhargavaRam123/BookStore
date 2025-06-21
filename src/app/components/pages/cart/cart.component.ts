import { Component, OnInit } from '@angular/core';
import { AppbarComponent } from '../../appbar/appbar.component';
import { UserService } from '../../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SuccessComponent } from '../../success/success.component';
interface Address {
  id: string;
  address: string;
  city: string;
  state: string;
  type: 'Home' | 'Work' | 'Other';
}

@Component({
  selector: 'app-cart',
  imports: [AppbarComponent, SuccessComponent, CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  issuccess: boolean = true;
  cartItems: any;
  addresses: Address[] = [];
  showAddAddressForm: boolean = false;
  editingAddressId: string | null = null;
  selectedAddressId: string | null = null; // Add this property

  newAddress: Address = {
    id: '',
    address: '',
    city: '',
    state: '',
    type: 'Home',
  };

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadCartItems();
    this.loadAddresses();
    this.loadSelectedAddress(); // Load previously selected address
  }

  loadAddresses() {
    const savedAddresses = localStorage.getItem('userAddresses');
    if (savedAddresses) {
      this.addresses = JSON.parse(savedAddresses);
    }
  }

  // Add method to load selected address
  loadSelectedAddress() {
    const savedSelectedAddress = localStorage.getItem('selectedAddressId');
    if (savedSelectedAddress) {
      this.selectedAddressId = savedSelectedAddress;
    }
  }

  // Add method to handle address selection
  onAddressSelect(addressId: string) {
    this.selectedAddressId = addressId;
    // Save selected address to localStorage
    localStorage.setItem('selectedAddressId', addressId);

    // Optional: Get the full address object
    const selectedAddress = this.addresses.find(
      (addr) => addr.id === addressId
    );
    console.log('Selected Address:', selectedAddress);
    console.log('Selected Address ID:', this.selectedAddressId);
  }

  // Add method to get selected address object
  getSelectedAddress(): Address | null {
    if (!this.selectedAddressId) return null;
    return (
      this.addresses.find((addr) => addr.id === this.selectedAddressId) || null
    );
  }

  saveAddressesToLocalStorage() {
    localStorage.setItem('userAddresses', JSON.stringify(this.addresses));
  }

  toggleAddAddressForm() {
    this.showAddAddressForm = true;
    this.resetNewAddressForm();
  }

  hideAddAddressForm() {
    this.showAddAddressForm = false;
    this.resetNewAddressForm();
  }

  resetNewAddressForm() {
    this.newAddress = {
      id: '',
      address: '',
      city: '',
      state: '',
      type: 'Home',
    };
  }

  addNewAddress() {
    if (
      this.newAddress.address.trim() &&
      this.newAddress.city.trim() &&
      this.newAddress.state.trim()
    ) {
      const newAddr: Address = {
        ...this.newAddress,
        id: this.generateId(),
      };

      this.addresses.push(newAddr);
      this.saveAddressesToLocalStorage();
      this.hideAddAddressForm();

      // Optional: Auto-select the newly added address
      // this.onAddressSelect(newAddr.id);
    }
  }

  editAddress(addressId: string) {
    this.editingAddressId = addressId;
  }

  saveAddress(address: Address) {
    const index = this.addresses.findIndex((addr) => addr.id === address.id);
    if (index !== -1) {
      this.addresses[index] = { ...address };
      this.saveAddressesToLocalStorage();
    }
    this.editingAddressId = null;
  }

  cancelEdit() {
    this.editingAddressId = null;
    this.loadAddresses(); // Reload to reset any unsaved changes
  }

  deleteAddress(addressId: string) {
    if (confirm('Are you sure you want to delete this address?')) {
      this.addresses = this.addresses.filter((addr) => addr.id !== addressId);
      this.saveAddressesToLocalStorage();

      // Clear selection if deleted address was selected
      if (this.selectedAddressId === addressId) {
        this.selectedAddressId = null;
        localStorage.removeItem('selectedAddressId');
      }
    }
  }

  isEditing(addressId: string): boolean {
    return this.editingAddressId === addressId;
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  onAddressTypeChange(address: Address, type: string) {
    address.type = type as 'Home' | 'Work' | 'Other';
  }

  onNewAddressTypeChange(type: string) {
    this.newAddress.type = type as 'Home' | 'Work' | 'Other';
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
}
