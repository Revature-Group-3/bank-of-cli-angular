import { Component, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AuthService } from '../../../services/auth-service';
import { TransactionService } from '../../../services/transaction-service';
import { CentsIntegerToDollarStringPipe } from '../../pipes/cents-integer-to-dollar-string-pipe';
import { NumericInputDirective } from '../../directives/numeric-input-directive';
import { ProgressBar } from '../../../progress-bar/progress-bar';

import { ToastService } from '../../../services/toast.service';

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
  private dialogRef = inject(MatDialogRef<Transfer>);
  private toast = inject(ToastService);

  // The current account balance is stored in cents.
  currentBalance = computed(() => this.auth.currentUser()?.balance ?? 0);

  // The user enters the transfer amount in dollars.
  transferAmount: number | null = null;

  // Convert dollars into whole cents for the service.
  get transferCents(): number {
    return Math.round((this.transferAmount ?? 0) * 100);
  }

  // Store the recipient's username.
  // This field now contains the recipient's email address.
  recipient = '';

  // Track loading and errors.
  isLoading = signal(false);
  errorMessage = signal('');

  submitTransfer(): void {

    // Prevent duplicate submissions.
    if (this.isLoading()) {
      return;
    }

    // Save the submitted values.
    const recipientEmail = this.recipient.trim();
    const amount = this.transferCents;

    this.errorMessage.set('');

    if (!recipientEmail) {
      this.errorMessage.set('Please enter the recipient’s email address.');
      return;
    }

    if (!Number.isSafeInteger(amount) || amount <= 0) {
      this.errorMessage.set('Please enter a valid amount greater than zero.');
      return;
    }

    // Start loading and clear previous feedback.
    this.isLoading.set(true);
    this.errorMessage.set('');

    const previousDisableClose = this.dialogRef.disableClose;

    // Prevent closing the dialog while processing.
    this.dialogRef.disableClose = true;

    // Temporary delay while using mock transaction data.
    // A real API request should control this loading state.
    // The API request now controls loading; the mock delay is removed.

    // Find the recipient using the team's existing service.
    // The backend now finds the recipient by email.

    // Preserve the team's transfer operation.
    // The transaction service expects whole cents.
    this.transactions.transfer({
      recipientAccountEmail: recipientEmail,
      amountInCents: amount
    })
      .pipe(
        finalize(() => {
          // The transaction operation has finished.
          this.isLoading.set(false);

          // Allow the user to correct the transfer or cancel.
          this.dialogRef.disableClose = previousDisableClose;
        })
      )
      .subscribe({
        next: result => {
          // Toast Notification
          this.toast.show('Transfer Successful.');

          // Close the dialog with the original transaction result.
          this.dialogRef.close(result);
        },

        error: (error: HttpErrorResponse) => {
          // Handle rejected transfers using the service error.
          const backendMessage =
            typeof error.error?.message === 'string'
              ? error.error.message
              : null;

          // Display the error to the user.
          if (error.status === 0) {
            this.errorMessage.set(
              'Unable to reach the server. Please try again.'
            );
          } else if (error.status === 401) {
            this.errorMessage.set(
              'Your session could not be verified. Please log in again.'
            );
          } else {
            this.errorMessage.set(
              backendMessage ?? 'Transfer failed. Please try again.'
            );
          }
        }
      });
  }
}