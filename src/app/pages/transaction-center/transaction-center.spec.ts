import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionCenter } from './transaction-center';

describe('TransactionCenter', () => {
  let component: TransactionCenter;
  let fixture: ComponentFixture<TransactionCenter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionCenter],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionCenter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
