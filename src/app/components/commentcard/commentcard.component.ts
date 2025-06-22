import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-commentcard',
  imports: [MatIconModule, CommonModule],
  templateUrl: './commentcard.component.html',
  styleUrl: './commentcard.component.css',
})
export class CommentcardComponent {
  rating = input<number>(0);
  comment = input<string>('');
  userName = input<string>('');
  createdAt = input<string>('');

  // Add this computed property
  userInitials = computed(() => {
    const name = this.userName();
    return name ? name.substring(0, 2).toUpperCase() : 'AC';
  });

  stars = computed(() => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      console.log('stars value', stars);
      stars.push(i <= this.rating());
    }
    return stars;
  });
}
