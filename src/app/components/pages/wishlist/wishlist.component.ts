import { Component, OnInit } from '@angular/core';
import { AppbarComponent } from '../../appbar/appbar.component';
import { CommonModule } from '@angular/common';
import { NotesService } from '../../../services/notes/notes.service';

@Component({
  selector: 'app-wishlist',
  imports: [AppbarComponent, CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent implements OnInit {
  isLoggedIn: boolean = false;
  wishlistitems: any;
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
    const accessToken = localStorage.getItem('accessToken');
    this.isLoggedIn = !!accessToken; // Convert to boolean
  }
}
