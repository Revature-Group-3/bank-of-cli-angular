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
  selector: 'app-transfer',
  styleUrl: './transfer.css',
  templateUrl: './transfer.html',
  standalone: true
})

export class Transfer {

  //This is temporary we'll refer to the users actual balance later. Another call to the service layer.
  currentBalance = 1250.00;
  transferAmount = 0;
  recipient = "";

  submitTransfer() {
    console.log('Transfer amount:', this.transferAmount);
    console.log('Current balance:', this.currentBalance);
    if (this.transferAmount > this.currentBalance){
      //Error
      console.log('Transfer Failure: ', this.transferAmount);
    }
    //Plug in the service layer here.
  }

}
