import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ModalService } from '../../services/commonservice/modal.service';
@Component({
  selector: 'app-appbar',
  imports: [MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './appbar.component.html',
  styleUrl: './appbar.component.css',
})
export class AppbarComponent {
  constructor(private modalService: ModalService) {}

  openModal() {
    this.modalService.openModal();
  }
}
