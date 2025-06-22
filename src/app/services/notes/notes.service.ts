import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpService } from '../httpServices/http.service';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  constructor(private httpservice: HttpService) {}

  getBooks(): Observable<any> {
    const headers = new HttpHeaders({
      accept: 'application/json',
    });

    return this.httpservice.getApi('bookstore_user/get/book', headers);
  }

  getWishlistItems(): Observable<any> {
    const accessToken = localStorage.getItem('accessToken');

    const headers = new HttpHeaders({
      accept: 'application/json',
      'x-access-token': accessToken || '',
    });

    return this.httpservice.getApi(
      'bookstore_user/get_wishlist_items',
      headers
    );
  }

  removeWishlistItem(productId: string): Observable<any> {
    const accessToken = localStorage.getItem('accessToken');

    const headers = new HttpHeaders({
      accept: 'application/json',
      'x-access-token': accessToken || '',
    });

    return this.httpservice.deleteApi(
      `bookstore_user/remove_wishlist_item/${productId}`,
      headers
    );
  }

  // Method to place order
  placeOrder(orderData: any): Observable<any> {
    const accessToken = localStorage.getItem('accessToken');

    const headers = new HttpHeaders({
      accept: 'application/json',
      'Content-Type': 'application/json',
      'x-access-token': accessToken || '',
    });

    return this.httpservice.postApi(
      'bookstore_user/add/order',
      orderData,
      headers
    );
  }

  // Method to get feedback for a specific book
  getFeedback(bookId: string): Observable<any> {
    const accessToken = localStorage.getItem('accessToken');

    const headers = new HttpHeaders({
      accept: 'application/json',
      'x-access-token': accessToken || '',
    });

    return this.httpservice.getApi(
      `bookstore_user/get/feedback/${bookId}`,
      headers
    );
  }

  // Method to add feedback for a specific book
  addFeedback(
    bookId: string,
    feedbackData: { comment: string; rating: string }
  ): Observable<any> {
    const accessToken = localStorage.getItem('accessToken');

    const headers = new HttpHeaders({
      accept: 'application/json',
      'Content-Type': 'application/json',
      'x-access-token': accessToken || '',
    });

    return this.httpservice.postApi(
      `bookstore_user/add/feedback/${bookId}`,
      feedbackData,
      headers
    );
  }
}
