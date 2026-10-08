import { Component, signal} from '@angular/core';
import { ProgressBar } from '../../progress-bar/progress-bar';

@Component({
  imports: [ ProgressBar ],
  selector: 'app-test',
  styleUrl: './test.css',
  templateUrl: './test.html',
})
export class Test {

  // Testing ValidationBox with input and button

  // showValidation = signal(false);
  // validationResult = signal('');
  // validationMessage = signal('');

  // submit(name: string) {
  //   if (!name.trim()) {
  //     this.validationMessage.set('Name is required.');
  //     this.validationResult.set('Error');
  //     this.showValidation.set(true);
  //   }
  //   else{
  //     this.validationMessage.set('You logged in');
  //     this.validationResult.set('Valid input');
  //     this.showValidation.set(true);
  //   }
  // }

  // -----------------------------------------------------------------------------------------
  //Test logic for progress bar button
  isLoading = signal(false); //
  // isLoading = signal(false);
  progressValue = signal(0);

  // Event for showing Indeterminate Progress bar
  // Make sure the example for Indeterminate Progress bar is uncommented in test.html
  submitI() {
    //show button
    this.isLoading.set(true); 

    // after 3 seconds sets progress bar to false
    setTimeout(() => { 
        this.isLoading.set(false);
    }, 3000);
  }

  // Event for showing Determinate Progress bar
  // Make sure the example for Determinate Progress bar is uncommented in test.html
  submitD() {
    if (this.isLoading() == false ) {
      this.isLoading.set(true);
    }
    else if (this.progressValue() >= 100) {
      this.progressValue.set(0);
      this.isLoading.set(false); 
    }
    else {
      this.progressValue.set(this.progressValue() + 5);
    }
    
    
     
    
  }
}