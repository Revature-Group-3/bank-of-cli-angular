
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AuthService } from '../../../services/auth-service';
import { TransactionService } from '../../../services/transaction-service';
import { ProgressBar } from '../../../progress-bar/progress-bar';
import { CentsIntegerToDollarStringPipe } from '../../pipes/cents-integer-to-dollar-string-pipe';

@Component({
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ProgressBar
    CentsIntegerToDollarStringPipe
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

  // Display the logged-in user's current balance.
  currentBalance = computed(() => this.auth.currentUser()?.balance ?? 0);

  // Amount entered by the user.
  withdrawalAmount = 0;

  // Track processing, errors, and success.
  isLoading = signal(false);
  // the logged-in user's real balance, in cents (0 if nobody is logged in)
  currentBalance = computed(() => this.auth.currentUser()?.balance ?? 0);

  // what the user types, in dollars (for example 19.99)
  withdrawalAmount = 0;

  // the typed amount as whole cents (19.99 becomes 1999), which is what the service expects
  get withdrawalCents(): number {
    return Math.round(this.withdrawalAmount * 100);
  }

  // the service's error message, shown under the input when a withdrawal is rejected
  errorMessage = signal('');
  successMessage = signal('');

  submitWithdrawal() {

    // Prevent duplicate withdrawals.
    if (this.isLoading() || this.successMessage()) {
    // if nobody is logged in, id 0 matches no account and the service returns its 401
    const result = this.transactions.withdraw({
      accountId: user?.id ?? 0,
      amount: this.withdrawalCents,
    });

    // an ApiError has a status; a successful transaction does not
    if ('status' in result) {
      this.errorMessage.set(result.message);
      return;
    }

    // Start loading and clear previous messages.
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    // Prevent closing the dialog during processing.
    this.dialogRef.disableClose = true;

    // Save the submitted values.
    const user = this.auth.currentUser();
    const amount = this.withdrawalAmount;

    // Temporary delay while using local mock data.
    setTimeout(() => {

      // Preserve the team's existing withdrawal operation.
      const result = this.transactions.withdraw({
        accountId: user?.id ?? 0,
        amount: amount
      });

      // Processing has finished.
      this.isLoading.set(false);

      // Show an error if the transaction was rejected.
      if ('status' in result) {
        this.errorMessage.set(result.message);
        this.dialogRef.disableClose = false;
        return;
      }

      // Show the successful withdrawal message.
      this.successMessage.set('Withdrawal successful!');

      // Keep the success message visible briefly.
      setTimeout(() => {

        // Close the dialog and return the original result.
        this.dialogRef.close(result);

      }, 1000);

    }, 1000);
  }
}
