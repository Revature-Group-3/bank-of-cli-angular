import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogBox } from '../../dialog-box/dialog-box';
import { MatButtonModule } from '@angular/material/button';
import { LocateAtm } from '../locate-atm/locate-atm';
import { Withdraw } from '../withdraw/withdraw';

@Component({
  imports: [MatButtonModule],
  standalone: true,
  selector: 'app-withdraw-dialog',
  styleUrl: './withdraw-dialog.css',
  templateUrl: './withdraw-dialog.html',
})
export class WithdrawDialog {

  constructor(private dialog: MatDialog) {}

  openWithdrawDialog() {

    const dialogRef = this.dialog.open(DialogBox, {
      width: '400px',
      data: {
        title: 'Withdraw Options',
        options: [
          { label: 'Withdraw', action: 'deposit' },
          { label: 'Cash Withdrawal', action: 'locateAtm' }
        ]
      }
    });

    dialogRef.afterClosed().subscribe(action => {

      if (action === 'deposit') {
        this.selectWithdraw();
      }

      if (action === 'locateAtm') {
        this.locateAtm();
      }
    });
  }

  selectWithdraw() {
    this.dialog.open(Withdraw, { width:'400px' })
  }

  locateAtm() {
    this.dialog.open(LocateAtm, { width: '600px' });
  }
}
