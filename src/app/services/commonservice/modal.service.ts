import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  // Using Angular signals for reactive state management
  private _showModal = signal(false);

  // Expose the signal as readonly
  readonly showModal = this._showModal.asReadonly();

  constructor() {}

  // Method to open the modal
  openModal(): void {
    this._showModal.set(true);
  }

  // Method to close the modal
  closeModal(): void {
    this._showModal.set(false);
  }

  // Method to get current modal state (useful for non-reactive contexts)
  getModalState(): boolean {
    return this._showModal();
  }
}
