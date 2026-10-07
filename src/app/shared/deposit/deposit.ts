import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-deposit',
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './deposit.html',
  styleUrl: './deposit.css'
})
export class Deposit {

  // This is temporary we'll refer to the users actual balance later.
  currentBalance = 1250.00;
  depositAmount = 0;

  submitDeposit() {
    console.log('Deposit amount:', this.depositAmount);
    console.log('Current balance:', this.currentBalance);

    //Plug in the service layer here.
  }

}
