
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

import { AuthService } from '../../../services/auth-service';
import { TransactionService } from '../../../services/transaction-service';
import { CentsIntegerToDollarStringPipe } from '../../pipes/cents-integer-to-dollar-string-pipe';
import { NumericInputDirective } from '../../directives/numeric-input-directive';
import { ProgressBar } from '../../../progress-bar/progress-bar';

@Component({
  selector: 'app-deposit',
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
  templateUrl: './deposit.html',
  styleUrl: './deposit.css',
  standalone: true
})
export class Deposit {

  // Use the team's existing services.
  private auth = inject(AuthService);
  private transactions = inject(TransactionService);
  private dialogRef = inject(MatDialogRef);
  private router = inject(Router);

  // The account balance is stored in whole cents.
  currentBalance = computed(() => this.auth.currentUser()?.balance ?? 0);

  // The user enters an amount in dollars.
  depositAmount: number | null = null;

  // Convert dollars to whole cents for the transaction service.
  get depositCents(): number {
    return Math.round((this.depositAmount ?? 0) * 100);
  }

  // Track loading, error, and success messages.
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  submitDeposit() {

    // Prevent duplicate submissions.
    if (this.isLoading() || this.successMessage()) {
      return;
    }

    // Save the submitted account and amount.
    const user = this.auth.currentUser();
    const amount = this.depositCents;

    // Start loading and clear previous messages.
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    // Prevent closing the dialog during processing.
    this.dialogRef.disableClose = true;

    // Temporary delay while transactions use mock data.
    // Replace with request-based loading when using an API.
    setTimeout(() => {

      // The transaction service expects whole cents.
      const result = this.transactions.deposit({
        accountId: user?.id ?? 0,
        amount: amount
      });

      // Processing has finished.
      this.isLoading.set(false);

      // Preserve the service's existing error handling.
      if ('status' in result) {
        this.errorMessage.set(result.message);
        this.dialogRef.disableClose = false;
        return;
      }

      // Confirm the successful deposit.
      this.successMessage.set('Deposit successful!');

      // Display the confirmation before closing.
      setTimeout(() => {

        // Return the original transaction result.
        this.dialogRef.close(result);

        // Return to the dashboard.
        this.router.navigate(['/dashboard']);

      }, 1000);

    }, 1000);
  }
}
