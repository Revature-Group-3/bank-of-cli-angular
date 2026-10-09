
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
  selector: 'app-transfer',
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
  templateUrl: './transfer.html',
  styleUrl: './transfer.css',
  standalone: true
})
export class Transfer {

  // Access the team's existing services.
  private auth = inject(AuthService);
  private transactions = inject(TransactionService);
  private dialogRef = inject(MatDialogRef);

  // The current account balance is stored in cents.
  currentBalance = computed(() => this.auth.currentUser()?.balance ?? 0);

  // The user enters the transfer amount in dollars.
  transferAmount: number | null = null;

  // Convert dollars into whole cents for the service.
  get transferCents(): number {
    return Math.round((this.transferAmount ?? 0) * 100);
  }

  // Store the recipient's username.
  recipient = '';

  // Track loading, errors, and success messages.
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  submitTransfer() {

    // Prevent duplicate submissions.
    if (this.isLoading() || this.successMessage()) {
      return;
    }

    // Save the submitted values.
    const sender = this.auth.currentUser();
    const recipientUsername = this.recipient.trim();
    const amount = this.transferCents;

    // Start loading and clear previous feedback.
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    // Prevent closing the dialog while processing.
    this.dialogRef.disableClose = true;

    // Temporary delay while using mock transaction data.
    // A real API request should control this loading state.
    setTimeout(() => {

      // Find the recipient using the team's existing service.
      const recipientAccount =
        this.auth.getAccountsByUsername(recipientUsername);

      // Preserve the team's transfer operation.
      // The transaction service expects whole cents.
      const result = this.transactions.transfer({
        senderAccountId: sender?.id ?? 0,
        recipientAccountId: recipientAccount?.id ?? 0,
        amount: amount
      });

      // The transaction operation has finished.
      this.isLoading.set(false);

      // Handle rejected transfers using the service error.
      if ('status' in result) {

        // Display the error to the user.
        this.errorMessage.set(result.message);

        // Allow the user to correct the transfer or cancel.
        this.dialogRef.disableClose = false;

        return;
      }

      // Confirm a successful transfer.
      this.successMessage.set('Transfer successful!');

      // Keep the confirmation visible for one second.
      setTimeout(() => {

        // Close the dialog with the original transaction result.
        this.dialogRef.close(result);

      }, 1000);

    }, 1000);
  }
}
