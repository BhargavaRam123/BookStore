import { Component, OnInit } from '@angular/core';
import { AppbarComponent } from '../../appbar/appbar.component';
import { NotesService } from '../../../services/notes/notes.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../card/card.component';
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
  selector: 'app-home',
  imports: [AppbarComponent, MatPaginatorModule, CommonModule, CardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  // Pagination properties
  allBooks: Book[] = [];
  displayedBooks: Book[] = [];
  totalBooks = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions = [5, 10, 25, 50];

  constructor(private notesService: NotesService) {}

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.notesService.getBooks().subscribe({
      next: (response) => {
        console.log('Books response:', response);

        this.allBooks = response.result;
        this.totalBooks = this.allBooks.length;

        this.updateDisplayedBooks();
      },
      error: (error) => {
        console.error('Error fetching books:', error);
      },
    });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedBooks();
  }

  private updateDisplayedBooks() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedBooks = this.allBooks.slice(startIndex, endIndex);
  }
}
