import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Address {
  id: string;
  address: string;
  city: string;
  state: string;
  type: 'Home' | 'Work' | 'Other';
}

@Component({
  selector: 'app-cartaddress',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cartaddress.component.html',
  styleUrl: './cartaddress.component.css',
})
export class CartaddressComponent implements OnInit {
  @Input() addresses: Address[] = [];
  @Input() selectedAddressId: string | null = null;
  @Input() stage: number = 1;
  @Output() addressSelect = new EventEmitter<string>();
  @Output() addressesChange = new EventEmitter<Address[]>();
  @Output() selectedAddressChange = new EventEmitter<string | null>();
  @Output() stageChange = new EventEmitter<void>();
  name: string | null;
  mobile: string | null;
  showAddAddressForm: boolean = false;
  editingAddressId: string | null = null;
  constructor() {
    this.name = localStorage.getItem('userFullName');
    this.mobile = localStorage.getItem('userPhone');
  }
  newAddress: Address = {
    id: '',
    address: '',
    city: '',
    state: '',
    type: 'Home',
  };

  ngOnInit() {
    this.loadAddresses();
  }
  moveToNextStage() {
    this.stageChange.emit();
  }

  loadAddresses() {
    const savedAddresses = localStorage.getItem('userAddresses');
    if (savedAddresses) {
      this.addresses = JSON.parse(savedAddresses);
      this.addressesChange.emit(this.addresses);
    }
  }

  onAddressSelect(addressId: string) {
    this.selectedAddressId = addressId;
    // Save selected address to localStorage
    localStorage.setItem('selectedAddressId', addressId);

    // Emit events to parent
    this.addressSelect.emit(addressId);
    this.selectedAddressChange.emit(addressId);

    // Optional: Get the full address object
    const selectedAddress = this.addresses.find(
      (addr) => addr.id === addressId
    );
    console.log('Selected Address:', selectedAddress);
    console.log('Selected Address ID:', this.selectedAddressId);
  }

  getSelectedAddress(): Address | null {
    if (!this.selectedAddressId) return null;
    return (
      this.addresses.find((addr) => addr.id === this.selectedAddressId) || null
    );
  }

  saveAddressesToLocalStorage() {
    localStorage.setItem('userAddresses', JSON.stringify(this.addresses));
    this.addressesChange.emit(this.addresses);
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
        this.selectedAddressChange.emit(null);
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
}
