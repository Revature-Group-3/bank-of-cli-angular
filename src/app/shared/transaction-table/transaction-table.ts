<<<<<<< HEAD
import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '../../services/auth-service';
import { TransactionService } from '../../services/transaction-service';
=======
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { CentsIntegerToDollarStringPipe } from '../pipes/cents-integer-to-dollar-string-pipe';
>>>>>>> e09874296338b11a635ea4a8d2a4cabc16a2a708

// what one table row looks like
interface TransactionRow {
  type: string;
  date: string;
  status: string;
  amount: number;
}

<<<<<<< HEAD
=======
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

>>>>>>> e09874296338b11a635ea4a8d2a4cabc16a2a708
@Component({
  imports: [MatTableModule, CentsIntegerToDollarStringPipe],
  selector: 'app-transaction-table',
  styleUrl: './transaction-table.css',
  templateUrl: './transaction-table.html',
})
export class TransactionTable {
  private auth = inject(AuthService);
  private transactionService = inject(TransactionService);

  readonly displayedColumns = ['Type', 'Date', 'Amount'];

  // the raw result: either { transactions } or an ApiError (or null if nobody is logged in)
  private result = computed(() => {
    const id = this.auth.currentUser()?.id;
    return id === undefined ? null : this.transactionService.getRecentTransactions(id);
  });

  // shown instead of the table if the call failed
  readonly errorMessage = computed(() => {
    const r = this.result();
    return r && 'message' in r ? r.message : null;
  });

  // the rows the table displays
  readonly dataSource = computed<TransactionRow[]>(() => {
    const r = this.result();
    const myId = this.auth.currentUser()?.id;
    if (!r || 'message' in r || myId === undefined) return [];

    return r.transactions.map((t): TransactionRow => {
      if (t.type === 'TRANSFER') {
        const sent = t.senderAccountId === myId;
        return {
          type: sent ? 'Transfer sent' : 'Transfer received',
          date: t.timestamp,
          status: 'Completed',
          amount: sent ? -t.amount : t.amount, // negative when money leaves
        };
      }
      return {
        type: t.type === 'DEPOSIT' ? 'Deposit' : 'Withdrawal',
        date: t.timestamp,
        status: 'Completed',
        amount: t.type === 'DEPOSIT' ? t.amount : -t.amount,
      };
    });
  });
}