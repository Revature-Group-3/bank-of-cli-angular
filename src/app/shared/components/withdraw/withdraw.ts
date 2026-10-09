
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AuthService } from '../../../services/auth-service';
import { TransactionService } from '../../../services/transaction-service';
import { CentsIntegerToDollarStringPipe } from '../../pipes/cents-integer-to-dollar-string-pipe';
import { NumericInputDirective } from '../../directives/numeric-input-directive';
import { ProgressBar } from '../../../progress-bar/progress-bar';

@Component({
  imports: [
    NumericInputDirective,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    CentsIntegerToDollarStringPipe,
    ProgressBar
  ],
  selector: 'app-withdraw',
  styleUrl: './withdraw.css',
  templateUrl: './withdraw.html',
  standalone: true
})
export class Withdraw {

  // Use the team's existing services.
  private auth = inject(AuthService);
  private transactions = inject(TransactionService);
  private dialogRef = inject(MatDialogRef);

  // The user's current balance is stored in whole cents.
  currentBalance = computed(() => this.auth.currentUser()?.balance ?? 0);

  // The user enters an amount in dollars.
  withdrawalAmount: number | null = null;

  // Convert dollars to cents for the transaction service.
  get withdrawalCents(): number {
    return Math.round((this.withdrawalAmount ?? 0) * 100);
  }

  // Track loading, errors, and successful withdrawals.
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  submitWithdrawal() {

    // Prevent duplicate submissions.
    if (this.isLoading() || this.successMessage()) {
      return;
    }

    // Save the submitted account and amount.
    const user = this.auth.currentUser();
    const amount = this.withdrawalCents;

    // Start processing and clear previous messages.
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    // Prevent closing the dialog while processing.
    this.dialogRef.disableClose = true;

    // Temporary delay while transactions use mock data.
    // A real API request should control this loading state.
    setTimeout(() => {

      // Preserve the team's existing withdrawal operation.
      // The service expects whole cents.
      const result = this.transactions.withdraw({
        accountId: user?.id ?? 0,
        amount: amount
      });

      // Processing has finished.
      this.isLoading.set(false);

      // Preserve the existing service error handling.
      if ('status' in result) {
        this.errorMessage.set(result.message);

        // Allow another attempt or cancellation.
        this.dialogRef.disableClose = false;
        return;
      }

      // Confirm the successful withdrawal.
      this.successMessage.set('Withdrawal successful!');

      // Keep the confirmation visible briefly.
      setTimeout(() => {

        // Close the dialog and return the transaction result.
        this.dialogRef.close(result);

      }, 1000);

    }, 1000);
  }
}
