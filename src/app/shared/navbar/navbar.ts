import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatDialog } from '@angular/material/dialog';

import { DepositDialog } from '../components/deposit-dialog/deposit-dialog';
import { WithdrawDialog } from '../components/withdraw-dialog/withdraw-dialog';
import { Transfer } from '../components/transfer/transfer';

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.html',
  styleUrl: 'navbar.css',
  imports: [MatListModule],
})

export class Navbar {

  constructor(private dialog: MatDialog) {}

  openDeposit() {
    const dialogComponent = new DepositDialog(this.dialog);
    dialogComponent.openDepositDialog();
  }

  openWithdraw() {
    const dialogComponent = new WithdrawDialog(this.dialog);
    dialogComponent.openWithdrawDialog();
  }

  openTransfer() {
    this.dialog.open(Transfer, { width: '400px' });
  }
}
