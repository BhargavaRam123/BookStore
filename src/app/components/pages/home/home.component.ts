import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { AppbarComponent } from '../../appbar/appbar.component';
import { NotesService } from '../../../services/notes/notes.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../card/card.component';
import { SignupComponent } from '../signup/signup.component';
import { ModalService } from '../../../services/commonservice/modal.service';
import { SearchService } from '../../../services/searchService/search.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
export class HomeComponent implements OnInit, OnDestroy {
  // Pagination properties
  showModal = signal(false);
  allBooks: Book[] = [];
  filteredBooks: Book[] = []; // Books after search filter
  displayedBooks: Book[] = []; // Books currently displayed (paginated)
  totalBooks = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions = [5, 10, 25, 50];
  currentSearchQuery = '';

  private destroy$ = new Subject<void>();

  constructor(
    private notesService: NotesService,
    private modalService: ModalService,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.loadBooks();
    this.setupSearchSubscription();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearchSubscription() {
    this.searchService.searchQuery$
      .pipe(takeUntil(this.destroy$))
      .subscribe((query: any) => {
        this.currentSearchQuery = query;
        this.filterBooks();
        this.resetPagination();
        this.updateDisplayedBooks();
      });
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

  loadBooks() {
    this.notesService.getBooks().subscribe({
      next: (response) => {
        console.log('Books response:', response);
        this.allBooks = response.result;
        this.filterBooks(); // Apply current search filter
        this.updateDisplayedBooks();
      },
      error: (error) => {
        console.error('Error fetching books:', error);
      },
    });
  }

  private filterBooks() {
    if (!this.currentSearchQuery) {
      this.filteredBooks = [...this.allBooks];
    } else {
      const query = this.currentSearchQuery.toLowerCase();
      this.filteredBooks = this.allBooks.filter(
        (book) =>
          book.bookName.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.description.toLowerCase().includes(query)
      );
    }
    this.totalBooks = this.filteredBooks.length;
  }

  private resetPagination() {
    this.currentPage = 0;
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedBooks();
  }

  private updateDisplayedBooks() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedBooks = this.filteredBooks.slice(startIndex, endIndex);
  }

  getDisplayText(): string {
    if (this.currentSearchQuery) {
      return `Search Results for "${this.currentSearchQuery}" (${this.filteredBooks.length} items)`;
    }
    return `Books (${this.allBooks.length} items)`;
  }
}
