import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ModalService } from '../../services/commonservice/modal.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-appbar',
  imports: [MatIconModule, MatMenuModule, MatButtonModule, CommonModule],
  templateUrl: './appbar.component.html',
  styleUrl: './appbar.component.css',
})
export class AppbarComponent {
  constructor(private modalService: ModalService, private router: Router) {}
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
    return localStorage.getItem('userFullName');
  }
  accessToken(): string | null {
    return localStorage.getItem('accessToken');
  }
  onLogout() {
    localStorage.setItem('accessToken', '');
    this.router.navigate(['/home']);
  }
}
