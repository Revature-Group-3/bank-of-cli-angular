import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogueBox } from '../../shared/dialogue-box/dialogue-box';
import { MatButtonModule } from '@angular/material/button';
import { LocateAtm } from '../../shared/locate-atm/locate-atm';
import { Deposit } from '../../shared/deposit/deposit';

@Component({
  imports: [MatButtonModule],
  selector: 'app-transaction-test',
  styleUrl: './transaction-test.css',
  templateUrl: './transaction-test.html',
})

export class TransactionTest {

  constructor(private dialog: MatDialog) {}

  openDepositDialog() {

    const dialogRef = this.dialog.open(DialogueBox, {
      width: '400px',
      data: {
        title: 'Deposit Options',
        options: [
          { label: 'Deposit', action: 'deposit' },
          { label: 'Cash Deposit', action: 'cashDeposit' },
          { label: 'Check Deposit', action: 'checkDeposit' },
          { label: 'Setup Direct Deposit', action: 'directDeposit' }
        ]
      }
    });

    dialogRef.afterClosed().subscribe(action => {

      if (action === 'deposit') {
        this.selectDeposit();
      }

      if (action === 'cashDeposit') {
        this.selectCashDeposit();
      }

      if (action === 'checkDeposit') {
        this.selectCheckDeposit();
      }

      if (action === 'directDeposit') {
        this.selectDirectDeposit();
      }

    });
  }

  selectDeposit() {
    this.dialog.open(Deposit, { width:'400px' })
  }

  selectCashDeposit() {
    this.dialog.open(LocateAtm, { width: '600px' });
  }

  selectCheckDeposit() {
    console.log('Opening check deposit');
  }

  selectDirectDeposit() {
    console.log('Opening direct deposit');
  }



}
