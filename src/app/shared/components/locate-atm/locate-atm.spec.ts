import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocateAtm } from './locate-atm';

describe('DepositCash', () => {
  let component: LocateAtm;
  let fixture: ComponentFixture<LocateAtm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocateAtm],
    }).compileComponents();

    fixture = TestBed.createComponent(LocateAtm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
