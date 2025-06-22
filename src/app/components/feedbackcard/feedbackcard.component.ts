import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NotesService } from '../../services/notes/notes.service';

@Component({
  selector: 'app-feedbackcard',
  imports: [MatIconModule, FormsModule],
  templateUrl: './feedbackcard.component.html',
  styleUrl: './feedbackcard.component.css',
})
export class FeedbackcardComponent {
  bookId: any = input('');
  commentValue = '';
  rating = 0;
  constructor(private notesService: NotesService) {}
  onRatingChange(value: number) {
    this.rating = value;
  }
  submitFeedback() {
    // Validation
    if (!this.commentValue.trim()) {
      alert('Please enter a comment');
      return;
    }

    if (this.rating === 0) {
      alert('Please select a rating');
      return;
    }

    if (!this.bookId) {
      alert('Book ID is required');
      return;
    }

    const feedbackData = {
      comment: this.commentValue.trim(),
      rating: this.rating.toString(),
    };

    this.notesService.addFeedback(this.bookId(), feedbackData).subscribe({
      next: (response) => {
        console.log('Feedback submitted successfully', response);
        alert('Feedback submitted successfully!');

        // Reset form
        this.commentValue = '';
        this.rating = 0;
      },
      error: (error) => {
        console.error('Error submitting feedback', error);
        alert('Error submitting feedback. Please try again.');
      },
    });
  }
}
