import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackcardComponent } from './feedbackcard.component';

describe('FeedbackcardComponent', () => {
  let component: FeedbackcardComponent;
  let fixture: ComponentFixture<FeedbackcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackcardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
