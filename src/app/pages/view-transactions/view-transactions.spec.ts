import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewTransactions } from './view-transactions';

describe('ViewTransactions', () => {
  let component: ViewTransactions;
  let fixture: ComponentFixture<ViewTransactions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTransactions],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewTransactions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
