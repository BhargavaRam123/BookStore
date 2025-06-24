import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppbarComponent } from '../../appbar/appbar.component';
import { FeedbackcardComponent } from '../../feedbackcard/feedbackcard.component';
import { CommentcardComponent } from '../../commentcard/commentcard.component';
import { NotesService } from '../../../services/notes/notes.service';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../../services/commonservice/modal.service';
import { SignupComponent } from '../signup/signup.component';
interface Book {
  _id: string;
  bookName: string;
  author: string;
  description: string;
  price: number;
  discountPrice: number;
  quantity: number;
  bookImage: string | null;
  admin_user_id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

@Component({
  selector: 'app-product-detail',
  imports: [
    AppbarComponent,
    FeedbackcardComponent,
    CommentcardComponent,
    CommonModule,
    SignupComponent,
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent implements OnInit {
  bookData: Book | null;
  feedbacks: any[] = [];
  averageRating: number = 0;
  totalRatings: number = 0;
  loading: boolean = false;
  addingToWishlist: boolean = false; // Loading state for wishlist button
  wishlistMessage: string = ''; // Success/error message

  // New properties for cart functionality
  isInCart: boolean = false;
  cartQuantity: number = 1;
  addingToCart: boolean = false;
  cartMessage: string = '';

  constructor(
    private router: Router,
    private notesService: NotesService,
    private modalService: ModalService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const bookData = navigation.extras.state['book'];
      console.log('bookdata value in the product page', bookData);
      this.bookData = bookData;
    } else {
      this.bookData = null;
    }
  }

  // Updated method to use the modal service
  closeModal() {
    this.modalService.closeModal();
  }

  // Additional methods for modal control
  openModal() {
    this.modalService.openModal();
  }
  getModalState() {
    return this.modalService.getModalState();
  }

  ngOnInit() {
    if (this.bookData?._id) {
      this.loadFeedback();
      this.checkIfInCart(); // Check if item is already in cart
    }
  }

  loadFeedback() {
    if (!this.bookData?._id) return;

    this.loading = true;
    this.notesService.getFeedback(this.bookData._id).subscribe({
      next: (response) => {
        console.log('Feedback response:', response);
        if (response.result && Array.isArray(response.result)) {
          this.feedbacks = response.result;
          console.log('feedback value', this.feedbacks);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading feedback:', error);
        this.loading = false;
      },
    });
  }

  // Check if item is already in cart
  checkIfInCart() {
    this.getCartItems();
  }

  // Get cart items to check current state
  getCartItems() {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      this.isInCart = false;
      return;
    }

    this.notesService.getCartItems().subscribe({
      next: (response) => {
        if (response.result && Array.isArray(response.result)) {
          const cartItem = response.result.find(
            (item: any) => item.product_id._id === this.bookData?._id
          );

          if (cartItem) {
            this.isInCart = true;
            this.cartQuantity = cartItem.product_id.quantity || 1;
          } else {
            this.isInCart = false;
            this.cartQuantity = 1;
          }
        }
      },
      error: (error) => {
        console.error('Error getting cart items:', error);
        this.isInCart = false;
      },
    });
  }

  // Method to add book to cart
  addToCart() {
    if (!this.bookData?._id) {
      console.error('No book data available');
      return;
    }

    // Check if user is logged in (has access token)
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      this.cartMessage = 'Please log in to add items to cart';
      this.clearCartMessageAfterDelay();
      return;
    }

    this.addingToCart = true;
    this.cartMessage = '';

    this.notesService.addToCart(this.bookData._id).subscribe({
      next: (response) => {
        console.log('Add to cart response:', response);
        this.addingToCart = false;
        this.isInCart = true;

        // Check if item was already in cart or newly added
        if (response.message && response.message.includes('already added')) {
          this.cartMessage = 'Item quantity increased in cart!';
        } else {
          this.cartMessage = 'Book added to cart successfully!';
        }

        this.clearCartMessageAfterDelay();
        this.getCartItems(); // Refresh cart to get current quantity
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        this.addingToCart = false;

        // Handle different error scenarios
        if (error.status === 401) {
          this.cartMessage = 'Please log in to add items to cart';
        } else {
          this.cartMessage = 'Failed to add book to cart. Please try again.';
        }

        this.clearCartMessageAfterDelay();
      },
    });
  }

  // Method to increase quantity
  increaseQuantity() {
    if (!this.bookData?._id) return;

    const newQuantity = this.cartQuantity + 1;

    this.notesService
      .updateCartItemQuantity(this.bookData._id, newQuantity)
      .subscribe({
        next: (response) => {
          console.log('Quantity increased:', response);
          this.cartQuantity = newQuantity;
          this.cartMessage = 'Quantity updated!';
          this.clearCartMessageAfterDelay();
        },
        error: (error) => {
          console.error('Error increasing quantity:', error);
          this.cartMessage = 'Failed to update quantity';
          this.clearCartMessageAfterDelay();
        },
      });
  }

  // Method to decrease quantity
  decreaseQuantity() {
    if (this.cartQuantity <= 1) {
      this.removeFromCart();
      return;
    }

    if (!this.bookData?._id) return;

    const newQuantity = this.cartQuantity - 1;

    this.notesService
      .updateCartItemQuantity(this.bookData._id, newQuantity)
      .subscribe({
        next: (response) => {
          console.log('Quantity decreased:', response);
          this.cartQuantity = newQuantity;
          this.cartMessage = 'Quantity updated!';
          this.clearCartMessageAfterDelay();
        },
        error: (error) => {
          console.error('Error decreasing quantity:', error);
          this.cartMessage = 'Failed to update quantity';
          this.clearCartMessageAfterDelay();
        },
      });
  }

  // Method to remove from cart
  removeFromCart() {
    if (!this.bookData?._id) return;

    this.notesService.removeCartItem(this.bookData._id).subscribe({
      next: (response) => {
        console.log('Removed from cart:', response);
        this.isInCart = false;
        this.cartQuantity = 1;
        this.cartMessage = 'Book removed from cart';
        this.clearCartMessageAfterDelay();
      },
      error: (error) => {
        console.error('Error removing from cart:', error);
        this.cartMessage = 'Failed to remove book from cart';
        this.clearCartMessageAfterDelay();
      },
    });
  }

  // Method to add book to wishlist
  addToWishlist() {
    if (!this.bookData?._id) {
      console.error('No book data available');
      return;
    }

    // Check if user is logged in (has access token)
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      this.wishlistMessage = 'Please log in to add items to wishlist';
      this.clearMessageAfterDelay();
      return;
    }

    this.addingToWishlist = true;
    this.wishlistMessage = '';

    this.notesService.addToWishlist(this.bookData._id).subscribe({
      next: (response) => {
        console.log('Add to wishlist response:', response);
        this.addingToWishlist = false;
        this.wishlistMessage = 'Book added to wishlist successfully!';
        this.clearMessageAfterDelay();
      },
      error: (error) => {
        console.error('Error adding to wishlist:', error);
        this.addingToWishlist = false;

        // Handle different error scenarios
        if (error.status === 401) {
          this.wishlistMessage = 'Please log in to add items to wishlist';
        } else if (error.status === 409) {
          this.wishlistMessage = 'Book is already in your wishlist';
        } else {
          this.wishlistMessage =
            'Failed to add book to wishlist. Please try again.';
        }

        this.clearMessageAfterDelay();
      },
    });
  }

  // Helper method to clear cart messages after a delay
  private clearCartMessageAfterDelay() {
    setTimeout(() => {
      this.cartMessage = '';
    }, 3000); // Clear message after 3 seconds
  }

  // Helper method to clear messages after a delay
  private clearMessageAfterDelay() {
    setTimeout(() => {
      this.wishlistMessage = '';
    }, 3000); // Clear message after 3 seconds
  }

  // Helper method to get full name with null checks
  getUserFullName(firstName?: string, lastName?: string): string {
    if (!firstName && !lastName) {
      return 'Anonymous User';
    }

    const first = firstName || '';
    const last = lastName || '';

    return `${first} ${last}`.trim() || 'Anonymous User';
  }
  tohome() {
    this.router.navigate(['home']);
  }
}
