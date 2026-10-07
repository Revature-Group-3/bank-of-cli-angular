import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogueBox } from './dialogue-box';

describe('DialogueBox', () => {
  let component: DialogueBox;
  let fixture: ComponentFixture<DialogueBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogueBox],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogueBox);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
