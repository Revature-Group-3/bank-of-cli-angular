import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogBox } from '../../dialog-box/dialog-box';
import { MatButtonModule } from '@angular/material/button';
import { LocateAtm } from '../locate-atm/locate-atm';
import { Deposit } from '../deposit/deposit';

@Component({
  imports: [MatButtonModule],
  standalone: true,
  selector: 'app-deposit-dialog',
  styleUrl: './deposit-dialog.css',
  templateUrl: './deposit-dialog.html',
})
export class DepositDialog {

  constructor(private dialog: MatDialog) { }

  openDepositDialog() {

    const dialogRef = this.dialog.open(DialogBox, {
      width: '400px',
      data: {
        title: 'Deposit Options',
        options: [
          { label: 'Deposit', action: 'deposit' },
          { label: 'Cash Deposit', action: 'locateATM' }
        ]
      }
    });

    dialogRef.afterClosed().subscribe(action => {

      if (action === 'deposit') {
        this.selectDeposit();
      }

      if (action === 'locateATM') {
        this.locateATM();
      }
    });
  }

  selectDeposit() {
    this.dialog.open(Deposit, { width: '400px' })
  }

  locateATM() {
    this.dialog.open(LocateAtm, { width: '600px' });
  }
}
