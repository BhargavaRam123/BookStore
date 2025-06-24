import { TestBed } from '@angular/core/testing';
import { HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';
import { UserService } from './user.service';
import { HttpService } from '../httpServices/http.service';

describe('UserService', () => {
  let service: UserService;
  let httpServiceSpy: jasmine.SpyObj<HttpService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('HttpService', ['postApi', 'getApi']);
    TestBed.configureTestingModule({
      providers: [UserService, { provide: HttpService, useValue: spy }],
    });
    service = TestBed.inject(UserService);
    httpServiceSpy = TestBed.inject(HttpService) as jasmine.SpyObj<HttpService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('signUp', () => {
    it('should call postApi with correct parameters', () => {
      const userData = { email: 'test@example.com', password: 'password123' };
      const mockResponse = { success: true };
      httpServiceSpy.postApi.and.returnValue(of(mockResponse));

      service.signUp(userData);

      expect(httpServiceSpy.postApi).toHaveBeenCalledWith(
        'bookstore_user/registration',
        userData,
        jasmine.any(HttpHeaders)
      );

      const headers = httpServiceSpy.postApi.calls.first()
        .args[2] as HttpHeaders;
      expect(headers.get('Content-Type')).toBe('application/json');
      expect(headers.get('Accept')).toBe('application/json');
    });
  });

  describe('logIn', () => {
    it('should call postApi with correct parameters', () => {
      const loginData = { email: 'test@example.com', password: 'password123' };
      const mockResponse = { success: true, token: 'mock-token' };
      httpServiceSpy.postApi.and.returnValue(of(mockResponse));

      service.logIn(loginData);

      expect(httpServiceSpy.postApi).toHaveBeenCalledWith(
        'bookstore_user/login',
        loginData,
        jasmine.any(HttpHeaders)
      );

      const headers = httpServiceSpy.postApi.calls.first()
        .args[2] as HttpHeaders;
      expect(headers.get('Content-Type')).toBe('application/json');
      expect(headers.get('Accept')).toBe('application/json');
    });
  });

  describe('getCartItems', () => {
    it('should call getApi with correct parameters', () => {
      const token = 'mock-jwt-token';
      const mockResponse = { success: true, cartItems: [] };
      httpServiceSpy.getApi.and.returnValue(of(mockResponse));

      service.getCartItems(token);

      expect(httpServiceSpy.getApi).toHaveBeenCalledWith(
        'bookstore_user/get_cart_items',
        jasmine.any(HttpHeaders)
      );

      const headers = httpServiceSpy.getApi.calls.first()
        .args[1] as HttpHeaders;
      expect(headers.get('Accept')).toBe('application/json');
      expect(headers.get('x-access-token')).toBe(token);
    });

    it('should handle empty token', () => {
      const emptyToken = '';
      httpServiceSpy.getApi.and.returnValue(of({ success: false }));

      service.getCartItems(emptyToken);

      expect(httpServiceSpy.getApi).toHaveBeenCalled();
      const headers = httpServiceSpy.getApi.calls.first()
        .args[1] as HttpHeaders;
      expect(headers.get('x-access-token')).toBe('');
    });
  });

  describe('Error Handling', () => {
    it('should handle HTTP errors', () => {
      const errorResponse = new Error('Network error');
      httpServiceSpy.postApi.and.throwError(errorResponse);

      expect(() => service.signUp({})).toThrowError('Network error');
    });
  });

  describe('Return Values', () => {
    it('should return observable from signUp', () => {
      const mockResponse = { success: true };
      httpServiceSpy.postApi.and.returnValue(of(mockResponse));

      const result = service.signUp({});

      result.subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });
    });

    it('should return observable from logIn', () => {
      const mockResponse = { success: true, token: 'test' };
      httpServiceSpy.postApi.and.returnValue(of(mockResponse));

      const result = service.logIn({});

      result.subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });
    });

    it('should return observable from getCartItems', () => {
      const mockResponse = { success: true, cartItems: [] };
      httpServiceSpy.getApi.and.returnValue(of(mockResponse));

      const result = service.getCartItems('token');

      result.subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });
    });
  });
});
