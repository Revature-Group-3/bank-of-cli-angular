import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { CentsIntegerToDollarStringPipe } from '../pipes/cents-integer-to-dollar-string-pipe';

export interface Transaction {
  transactionType: string;
  date: string;
  transactionStatus: string;
  amount: number;
}

export const transactionData: Transaction[] = [
  {
    transactionType: 'Deposit',
    date: 'Oct 1, 2026',
    transactionStatus: 'Completed',
    amount: 12000,
  },
  {
    transactionType: 'Withdraw',
    date: 'Oct 1, 2026',
    transactionStatus: 'Completed',
    amount: 1200,
  },
  {
    transactionType: 'Transfer',
    date: 'Oct 3, 2026',
    transactionStatus: 'Pending',
    amount: 12000,
  },
  {
    transactionType: 'Transfer',
    date: 'Oct 3, 2026',
    transactionStatus: 'Failed',
    amount: 12000,
  },
  {
    transactionType: 'Deposit',
    date: 'Oct 13, 2026',
    transactionStatus: 'Success',
    amount: 1000,
  },
  {
    transactionType: 'Deposit',
    date: 'Oct 13, 2026',
    transactionStatus: 'Success',
    amount: 100000,
  }
];

@Component({
  imports: [MatTableModule, CentsIntegerToDollarStringPipe],
  selector: 'app-transaction-table',
  styleUrl: './transaction-table.css',
  templateUrl: './transaction-table.html',
})
export class TransactionTable {
  readonly dataSource = [...transactionData].reverse();
  readonly displayedColumns = ['Type', 'Date', 'Status', 'Amount'];
}
