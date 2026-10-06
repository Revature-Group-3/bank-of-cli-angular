import { Component } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';

// User-facing dashboard
@Component({
  imports: [MatGridListModule],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  // Material grid row height
  rowHeight: number = 50;
}
