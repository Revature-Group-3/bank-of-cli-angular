import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionTest } from './transaction-test';

describe('TransactionTest', () => {
  let component: TransactionTest;
  let fixture: ComponentFixture<TransactionTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionTest],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionTest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
