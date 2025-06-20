import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppbarComponent } from '../../appbar/appbar.component';
import { FeedbackcardComponent } from '../../feedbackcard/feedbackcard.component';
import { CommentcardComponent } from '../../commentcard/commentcard.component';
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
  imports: [AppbarComponent, FeedbackcardComponent, CommentcardComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent {
  bookData: Book | null;
  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const bookData = navigation.extras.state['book'];
      console.log('bookdata value in the product page', bookData);
      this.bookData = bookData;
    } else {
      this.bookData = null;
    }
  }
}
