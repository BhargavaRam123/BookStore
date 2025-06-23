import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppbarComponent } from '../../appbar/appbar.component';
import { FeedbackcardComponent } from '../../feedbackcard/feedbackcard.component';
import { CommentcardComponent } from '../../commentcard/commentcard.component';
import { NotesService } from '../../../services/notes/notes.service';
import { CommonModule } from '@angular/common';

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

  constructor(private router: Router, private notesService: NotesService) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const bookData = navigation.extras.state['book'];
      console.log('bookdata value in the product page', bookData);
      this.bookData = bookData;
    } else {
      this.bookData = null;
    }
  }

  ngOnInit() {
    if (this.bookData?._id) {
      this.loadFeedback();
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
}
