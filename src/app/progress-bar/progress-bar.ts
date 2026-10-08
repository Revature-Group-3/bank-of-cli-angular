import { Component, input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  imports: [MatProgressBarModule],
  selector: 'app-progress-bar',
  styleUrl: './progress-bar.css',
  templateUrl: './progress-bar.html',
})


// Exports material progress bar from Angular Material components
// Add ProgressBar to import
// Call indeterminate loading bar with <app-progress-bar [showProgress]="isLoading()" /> in the template
// Call determinate loading bar with
//                 <app-progress-bar [showProgress]="isLoading()" progressMode="determinate" [progressValue]="progressValue()" /> 
// in the template

export class ProgressBar {
  showProgress = input(false); // turn on and off
  progressMode = input<'indeterminate' | 'determinate'>('indeterminate'); // set type of bar, default to indeterminate
  progressValue = input(0); // updates value of the progress bar when set to 'determinate'
}
