import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-appbar',
  imports: [MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './appbar.component.html',
  styleUrl: './appbar.component.css',
})
export class AppbarComponent {}
