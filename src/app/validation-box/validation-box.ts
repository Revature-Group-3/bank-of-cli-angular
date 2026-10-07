import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-validation-box',
  styleUrl: './validation-box.css',
  templateUrl: './validation-box.html',
})
export class ValidationBox {

  // Component creates a popup to display valid or invalid responses
  // import { ValidationBox } from './validation-box/validation-box'; 
  // <app-validation-box [validationVisible]="showValidation()" [validationResult]="validationResult()" [validationMessage]="validationMessage()"
  //   (closed)="showBox.set(false)" />
  
  // requires fields for message and result for the validation component
  // update fields with type of validation and message to show, and set showValidation(true) in parent component to render
  // A button to close and empty popup is created in the popup itself, no need to create closing logic


  validationVisible = input(false);
  validationMessage = input('Validation Message');
  validationResult = input('Validation Result');

  closed = output<void>();

  close() {
    this.closed.emit();
  }

}
