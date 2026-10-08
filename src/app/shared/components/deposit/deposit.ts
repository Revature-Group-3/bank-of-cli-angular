
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

import { AuthService } from '../../../services/auth-service';
import { TransactionService } from '../../../services/transaction-service';

// Reuse the team's existing progress bar component.
import { ProgressBar } from '../../../progress-bar/progress-bar';

@Component({
  selector: 'app-deposit',
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ProgressBar
  ],
  templateUrl: './deposit.html',
  styleUrl: './deposit.css',
  standalone: true
})
export class Deposit {

  // Access the team's existing services.
  private auth = inject(AuthService);
  private transactions = inject(TransactionService);
  private dialogRef = inject(MatDialogRef);
  private router = inject(Router);

  // Display the logged-in user's current account balance.
  currentBalance = computed(() => this.auth.currentUser()?.balance ?? 0);

  // Amount entered by the user.
  depositAmount = 0;

  // Track loading, error, and success messages.
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  submitDeposit() {

    // Prevent duplicate submissions while processing or after success.
    if (this.isLoading() || this.successMessage()) {
      return;
    }

    // Start loading and clear previous messages.
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    // Prevent closing the dialog while processing.
    this.dialogRef.disableClose = true;

    // Store the submitted account and amount.
    const user = this.auth.currentUser();
    const amount = this.depositAmount;

    // Temporary 1-second delay while using local mock data.
    // Remove this delay when using a real HTTP request.
    setTimeout(() => {

      // Call the team's existing deposit service.
      const result = this.transactions.deposit({
        accountId: user?.id ?? 0,
        amount: amount
      });

      // The deposit operation has finished.
      this.isLoading.set(false);

      // Check whether the deposit was rejected.
      if ('status' in result) {

        // Display the existing service's error message.
        this.errorMessage.set(result.message);

        // Allow the user to correct the amount or close the dialog.
        this.dialogRef.disableClose = false;

        return;
      }

      // Deposit succeeded.
      this.successMessage.set('Deposit successful!');

      // Allow the user to see the success message for 1 second.
      setTimeout(() => {

        // Close the deposit dialog.
        this.dialogRef.close(result);

        // Return to the dashboard without reloading the page.
        // The updated balance comes from the existing AuthService.
        this.router.navigate(['/dashboard']);

      }, 1000); // End success-message delay.

    }, 1000); // End transaction-processing delay.

  } // End submitDeposit().

} // End Deposit class.
