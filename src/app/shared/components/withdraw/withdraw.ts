import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
@Component({
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule
  ],
  selector: 'app-withdraw',
  styleUrl: './withdraw.css',
  templateUrl: './withdraw.html',
  standalone: true
})

export class Withdraw {

  //This is temporary we'll refer to the users actual balance later. Another call to the service layer.
  currentBalance = 1250.00;
  withdrawalAmount = 0;

  submitWithdrawal() {
    console.log('Withdrawal amount:', this.withdrawalAmount);
    console.log('Current balance:', this.currentBalance);
    if (this.withdrawalAmount > this.currentBalance){
      //Error
      console.log('Withdrawal Failure: ', this.withdrawalAmount);
    }
    //Plug in the service layer here.
  }

}
