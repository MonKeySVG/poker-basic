import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardOnScreenComponent } from './card-on-screen.component';

describe('CardOnScreenComponent', () => {
  let component: CardOnScreenComponent;
  let fixture: ComponentFixture<CardOnScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardOnScreenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardOnScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
