import { Component, input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
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
  selector: 'app-card',
  imports: [MatIconModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent implements OnInit {
  book = input<Book>();
  index = input();
  constructor() {}

  ngOnInit() {
    console.log(
      'book value and index value are ',
      this.book(),
      this.index(),
      this.book()?.bookName
    );
  }
}
