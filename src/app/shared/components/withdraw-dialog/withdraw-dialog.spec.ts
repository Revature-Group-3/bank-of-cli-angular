import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WithdrawDialog } from './withdraw-dialog';

describe('WithdrawDialog', () => {
  let component: WithdrawDialog;
  let fixture: ComponentFixture<WithdrawDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WithdrawDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(WithdrawDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
