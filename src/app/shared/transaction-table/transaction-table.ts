import { Component, DestroyRef, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth-service';
import { TransactionService } from '../../services/transaction-service';
import { CentsIntegerToDollarStringPipe } from '../pipes/cents-integer-to-dollar-string-pipe';

// what one table row looks like
interface TransactionRow {
  type: string;
  date: string;
  status: string;
  amount: number;
}

@Component({
  imports: [MatTableModule, CentsIntegerToDollarStringPipe, DatePipe],
  selector: 'app-transaction-table',
  styleUrl: './transaction-table.css',
  templateUrl: './transaction-table.html',
})
export class TransactionTable {

  private auth = inject(AuthService);
  private transactionService = inject(TransactionService);
  private destroyRef = inject(DestroyRef);

  readonly displayedColumns = ['Type', 'Date', 'Amount'];
  readonly errorMessage = signal<string | null>(null);
  readonly dataSource = signal<TransactionRow[]>([]);
  readonly isLoading = signal(true);

  constructor() {
    const myId = this.auth.currentUser()?.id;

    if (myId === undefined) {
      this.errorMessage.set('You must be logged in to view transactions.');
      this.isLoading.set(false);
      return;
    }

    this.transactionService.getRecentTransactions()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => {
          this.dataSource.set(
            response.transactions.map(transaction => ({
              type: transaction.type,
              date: transaction.timestamp,
              status: 'Loaded in recent transactions.',
              amount: transaction.amountInCents,
            })));
          this.isLoading.set(false);
        },
        error: err => {
          this.errorMessage.set(
            err.error?.message ?? err.message ?? 'Retrieval Failed.');
          this.isLoading.set(false);
        }
      });
  }
}