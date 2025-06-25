import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { NotesService } from '../../services/notes/notes.service';

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

  constructor(private notesService: NotesService) {}

  onPlaceOrder() {
    this.placeOrder.emit();
  }

  increaseQuantity(item: any) {
    const newQuantity = item.quantityToBuy + 1;
    this.updateCartItemQuantity(item._id, newQuantity, item, 'increase');
  }

  decreaseQuantity(item: any) {
    const newQuantity = Math.max(1, item.quantityToBuy - 1);
    this.updateCartItemQuantity(item._id, newQuantity, item, 'decrease');
  }

  removeItem(item: any) {
    this.itemRemove.emit(item);
  }

  moveToNextStage() {
    this.stageChange.emit();
  }

  private updateCartItemQuantity(
    cartItemId: string,
    quantity: number,
    item: any,
    action: 'increase' | 'decrease'
  ) {
    console.log('man new quantity value', quantity);
    this.notesService.updateCartItemQuantity(cartItemId, quantity).subscribe({
      next: (response) => {
        console.log('Cart item updated successfully:', response);
        console.log('man new quantity value', quantity);
        this.quantityChange.emit({ item, action });
      },
      error: (error) => {
        console.error('Error updating cart item quantity:', error);
      },
    });
  }
}
