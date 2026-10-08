
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AuthService } from '../../../services/auth-service';
import { TransactionService } from '../../../services/transaction-service';

// Reuse the team's existing progress bar.
import { ProgressBar } from '../../../progress-bar/progress-bar';

@Component({
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ProgressBar
  ],
  selector: 'app-transfer',
  styleUrl: './transfer.css',
  templateUrl: './transfer.html',
  standalone: true
})
export class Transfer {

  // Use the team's existing services.
  private auth = inject(AuthService);
  private transactions = inject(TransactionService);
  private dialogRef = inject(MatDialogRef);

  // Display the logged-in user's balance.
  currentBalance = computed(() => this.auth.currentUser()?.balance ?? 0);

  // Store the entered amount and recipient.
  transferAmount = 0;
  recipient = '';

  // Track loading, errors, and success.
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  submitTransfer() {

    // Prevent duplicate transfers.
    if (this.isLoading() || this.successMessage()) {
      return;
    }

    // Start loading and clear previous messages.
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    // Prevent closing the dialog during processing.
    this.dialogRef.disableClose = true;

    // Save the submitted values.
    const sender = this.auth.currentUser();
    const recipientUsername = this.recipient.trim();
    const amount = this.transferAmount;

    // Temporary delay while using local mock data.
    setTimeout(() => {

      // Find the recipient using the team's existing method.
      const recipientAccount =
        this.auth.getAccountsByUsername(recipientUsername);

      // Preserve the team's existing transfer operation.
      const result = this.transactions.transfer({
        senderAccountId: sender?.id ?? 0,
        recipientAccountId: recipientAccount?.id ?? 0,
        amount: amount
      });

      // Processing has finished.
      this.isLoading.set(false);

      // Show an error if the transfer was rejected.
      if ('status' in result) {
        this.errorMessage.set(result.message);

        // Allow corrections or cancellation.
        this.dialogRef.disableClose = false;
        return;
      }

      // Show confirmation after a successful transfer.
      this.successMessage.set('Transfer successful!');

      // Keep the success message visible briefly.
      setTimeout(() => {

        // Close the dialog and return the original result.
        this.dialogRef.close(result);

      }, 1000);

    }, 1000);
  }
}
