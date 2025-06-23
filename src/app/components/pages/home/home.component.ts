import { Component, OnInit, signal } from '@angular/core';
import { AppbarComponent } from '../../appbar/appbar.component';
import { NotesService } from '../../../services/notes/notes.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../card/card.component';
import { SignupComponent } from '../signup/signup.component';
import { ModalService } from '../../../services/commonservice/modal.service';
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
  imports: [
    AppbarComponent,
    MatPaginatorModule,
    CommonModule,
    CardComponent,
    SignupComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  // Pagination properties
  showModal = signal(false);
  allBooks: Book[] = [];
  displayedBooks: Book[] = [];
  totalBooks = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions = [5, 10, 25, 50];

  constructor(
    private notesService: NotesService,
    private modalService: ModalService
  ) {}
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
