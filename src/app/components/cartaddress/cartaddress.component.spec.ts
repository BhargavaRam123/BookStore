import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartaddressComponent } from './cartaddress.component';

describe('CartaddressComponent', () => {
  let component: CartaddressComponent;
  let fixture: ComponentFixture<CartaddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartaddressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartaddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
