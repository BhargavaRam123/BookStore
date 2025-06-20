import { Component, OnInit } from '@angular/core';
import { AppbarComponent } from '../../appbar/appbar.component';
import { CommonModule } from '@angular/common';
import { NotesService } from '../../../services/notes/notes.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-wishlist',
  imports: [AppbarComponent, CommonModule, MatIconModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent implements OnInit {
  isLoggedIn: boolean = false;
  wishlistitems: any;
  isRemoving: { [key: string]: boolean } = {};
  constructor(private notesservice: NotesService) {}
  ngOnInit(): void {
    this.checkAuthStatus();
    this.notesservice.getWishlistItems().subscribe({
      next: (response) => {
        console.log('Wishlist items:', response);
        this.wishlistitems = [...response.result];
      },
      error: (error) => {
        console.error('Error fetching wishlist:', error);
      },
    });
  }

  checkAuthStatus(): void {
    // const accessToken = localStorage.getItem('accessToken');
    // this.isLoggedIn = !!accessToken; // Convert to boolean
    this.isLoggedIn = true; // Convert to boolean
  }
  removeFromWishlist(productId: string): void {
    this.isRemoving[productId] = true;

    this.notesservice.removeWishlistItem(productId).subscribe({
      next: (response) => {
        console.log('Item removed from wishlist:', response);
        this.wishlistitems = this.wishlistitems.filter(
          (item: any) => item.id !== productId && item._id !== productId
        );

        this.isRemoving[productId] = false;
      },
      error: (error) => {
        console.error('Error removing item from wishlist:', error);

        this.isRemoving[productId] = false;
      },
    });
  }
}
