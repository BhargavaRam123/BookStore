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
}
