import { Component } from '@angular/core';
import { TransactionTable } from '../../shared/transaction-table/transaction-table';

@Component({
  imports: [TransactionTable],
  selector: 'app-view-transactions',
  styleUrl: './view-transactions.css',
  templateUrl: './view-transactions.html',
})
export class ViewTransactions {}
