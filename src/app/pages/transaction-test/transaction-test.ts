import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DepositDialog } from '../../shared/components/deposit-dialog/deposit-dialog';
import { WithdrawDialog } from '../../shared/components/withdraw-dialog/withdraw-dialog';
@Component({
  imports: [MatButtonModule, DepositDialog, WithdrawDialog],
  selector: 'app-transaction-test',
  styleUrl: './transaction-test.css',
  templateUrl: './transaction-test.html',
  standalone: true
})

export class TransactionTest {
}
