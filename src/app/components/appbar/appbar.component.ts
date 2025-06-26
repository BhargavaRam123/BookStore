import {
  Component,
  input,
  output,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ModalService } from '../../services/commonservice/modal.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../services/searchService/search.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-appbar',
  imports: [
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './appbar.component.html',
  styleUrl: './appbar.component.css',
})
export class AppbarComponent implements OnInit, OnDestroy {
  searchQuery: string = '';
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(
    private modalService: ModalService,
    private router: Router,
    private searchService: SearchService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // Debounce search input to avoid too many API calls
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((query) => {
        this.searchService.updateSearchQuery(query);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
    this.searchSubject.next(this.searchQuery);
  }

  onSearchSubmit() {
    this.searchService.updateSearchQuery(this.searchQuery);
  }

  clearSearch() {
    this.searchQuery = '';
    this.searchService.updateSearchQuery('');
  }

  toProfile() {
    this.router.navigate(['/userprofile']);
  }

  toHome() {
    this.router.navigate(['/home']);
  }

  toCart() {
    this.router.navigate(['/cart']);
  }

  toWishList() {
    this.router.navigate(['/wishlist']);
  }

  openModal() {
    this.modalService.openModal();
  }

  getName() {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('userFullName');
    }
    return null;
  }

  accessToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  onLogout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('accessToken', '');
      this.router.navigate(['/home']);
    }
  }
}
