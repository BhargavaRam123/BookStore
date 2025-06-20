import { Component, OnInit } from '@angular/core';
import { AppbarComponent } from '../../appbar/appbar.component';
import { InputComponent } from '../../input/input.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Address {
  id: string;
  address: string;
  city: string;
  state: string;
  type: 'Home' | 'Work' | 'Other';
}

@Component({
  selector: 'app-user-profile',
  imports: [AppbarComponent, FormsModule, CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  userFullName: string = '';
  userEmail: string = '';
  userPassword: string = '';
  userPhone: string = '';

  addresses: Address[] = [];
  showAddAddressForm: boolean = false;
  editingAddressId: string | null = null;

  newAddress: Address = {
    id: '',
    address: '',
    city: '',
    state: '',
    type: 'Home',
  };

  editableFields = {
    fullName: false,
    email: false,
    password: false,
    phone: false,
  };

  ngOnInit() {
    this.loadUserData();
    this.loadAddresses();
  }

  loadUserData() {
    this.userFullName = localStorage.getItem('userFullName') || '';
    this.userEmail = localStorage.getItem('userEmail') || '';
    this.userPassword = localStorage.getItem('userPassword') || '';
    this.userPhone = localStorage.getItem('userPhone') || '';
  }

  loadAddresses() {
    const savedAddresses = localStorage.getItem('userAddresses');
    if (savedAddresses) {
      this.addresses = JSON.parse(savedAddresses);
    }
  }

  saveAddressesToLocalStorage() {
    localStorage.setItem('userAddresses', JSON.stringify(this.addresses));
  }

  makeFieldEditable(field: string) {
    this.editableFields[field as keyof typeof this.editableFields] = true;
  }

  onFieldBlur(field: string) {
    this.editableFields[field as keyof typeof this.editableFields] = false;
    this.saveFieldToLocalStorage(field);
  }

  saveFieldToLocalStorage(field: string) {
    switch (field) {
      case 'fullName':
        localStorage.setItem('userFullName', this.userFullName);
        break;
      case 'email':
        localStorage.setItem('userEmail', this.userEmail);
        break;
      case 'password':
        localStorage.setItem('userPassword', this.userPassword);
        break;
      case 'phone':
        localStorage.setItem('userPhone', this.userPhone);
        break;
    }
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
