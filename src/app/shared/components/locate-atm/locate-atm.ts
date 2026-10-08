import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  imports: [MatButtonModule, MatDialogModule],
  selector: 'app-deposit-cash',
  styleUrl: './locate-atm.css',
  templateUrl: './locate-atm.html',
  standalone: true
})
export class LocateAtm {}
