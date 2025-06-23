import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private searchQuerySubject = new BehaviorSubject<string>('');
  public searchQuery$ = this.searchQuerySubject.asObservable();

  constructor() {}

  updateSearchQuery(query: string): void {
    this.searchQuerySubject.next(query.trim());
  }

  getCurrentSearchQuery(): string {
    return this.searchQuerySubject.value;
  }

  clearSearch(): void {
    this.searchQuerySubject.next('');
  }
}
