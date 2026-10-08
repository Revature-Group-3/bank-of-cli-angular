import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

export interface Transaction {
  transactionType: string;
  date: string;
  transactionStatus: string;
  amount: number;
}

@Component({
  imports: [MatTableModule, CurrencyPipe],
  selector: 'app-transaction-table',
  styleUrl: './transaction-table.css',
  templateUrl: './transaction-table.html',
})
export class TransactionTable {
  dataSource: Transaction[] = [];
  readonly displayedColumns = ['Type', 'Date', 'Status', 'Amount'];
}
