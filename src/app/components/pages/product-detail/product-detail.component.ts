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
