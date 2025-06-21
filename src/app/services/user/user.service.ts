import { Injectable } from '@angular/core';
import { HttpService } from '../httpServices/http.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpService: HttpService) {}
  signUp(data: any) {
    let endPoint: string = 'bookstore_user/registration';
    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.httpService.postApi(endPoint, data, header);
  }
  logIn(data: any) {
    let endPoint: string = 'bookstore_user/login';
    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.httpService.postApi(endPoint, data, header);
  }

  getCartItems(token: string) {
    let endPoint: string = 'bookstore_user/get_cart_items';
    let header = new HttpHeaders({
      Accept: 'application/json',
      'x-access-token': token,
    });
    return this.httpService.getApi(endPoint, header);
  }
}
