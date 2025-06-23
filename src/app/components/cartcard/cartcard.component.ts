import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon, MatIconModule } from '@angular/material/icon';

interface Address {
  id: string;
  address: string;
  city: string;
  state: string;
  type: 'Home' | 'Work' | 'Other';
}

@Component({
  selector: 'app-cartcard',
  imports: [CommonModule, MatIcon],
  templateUrl: './cartcard.component.html',
  styleUrl: './cartcard.component.css',
})
export class CartcardComponent {
  @Input() cartItems: any[] = [];
  @Input() addresses: Address[] = [];
  @Input() selectedAddress: Address | null = null;
  @Input() stage: number = 1;
  @Output() placeOrder = new EventEmitter<void>();
  @Output() quantityChange = new EventEmitter<{
    item: any;
    action: 'increase' | 'decrease';
  }>();
  @Output() stageChange = new EventEmitter<void>();
  @Output() itemRemove = new EventEmitter<any>();

  onPlaceOrder() {
    this.placeOrder.emit();
  }

  increaseQuantity(item: any) {
    this.quantityChange.emit({ item, action: 'increase' });
  }

  decreaseQuantity(item: any) {
    this.quantityChange.emit({ item, action: 'decrease' });
  }

  removeItem(item: any) {
    this.itemRemove.emit(item);
  }
  moveToNextStage() {
    this.stageChange.emit();
  }
}
