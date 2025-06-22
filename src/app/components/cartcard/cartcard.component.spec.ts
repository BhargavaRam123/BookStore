import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartcardComponent } from './cartcard.component';

describe('CartcardComponent', () => {
  let component: CartcardComponent;
  let fixture: ComponentFixture<CartcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartcardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
