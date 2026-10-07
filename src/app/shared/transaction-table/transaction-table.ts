import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

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
    amount: 120,
  },
  {
    transactionType: 'Withdraw',
    date: 'Oct 1, 2026',
    transactionStatus: 'Completed',
    amount: 12,
  },
  {
    transactionType: 'Transfer',
    date: 'Oct 3, 2026',
    transactionStatus: 'Pending',
    amount: 120,
  },
  {
    transactionType: 'Transfer',
    date: 'Oct 3, 2026',
    transactionStatus: 'Failed',
    amount: 120,
  },
  {
    transactionType: 'Deposit',
    date: 'Oct 13, 2026',
    transactionStatus: 'Success',
    amount: 10,
  },
  {
    transactionType: 'Deposit',
    date: 'Oct 13, 2026',
    transactionStatus: 'Success',
    amount: 1000,
  }
];

@Component({
  imports: [MatTableModule, CurrencyPipe],
  selector: 'app-transaction-table',
  styleUrl: './transaction-table.css',
  templateUrl: './transaction-table.html',
})
export class TransactionTable {
  readonly dataSource = [...transactionData].reverse();
  readonly displayedColumns = ['Type', 'Date', 'Status', 'Amount'];
}
