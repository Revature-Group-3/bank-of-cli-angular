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

import { ToastService } from '../../../services/toast.service';

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
  private toast = inject(ToastService);
  private router = inject(Router);

  // The user's current balance is stored in whole cents.
  currentBalance = computed(() => this.auth.currentUser()?.balance ?? 0);

  // The user enters an amount in dollars.
  withdrawalAmount: number | null = null;

  // Convert dollars to cents for the transaction service.
  get withdrawalCents(): number {
    return Math.round((this.withdrawalAmount ?? 0) * 100);
  }

  // Track loading and errors.
  isLoading = signal(false);
  errorMessage = signal('');

  submitWithdrawal() {

    // Prevent duplicate submissions.
    if (this.isLoading()) {
      return;
    }

    // Save the submitted account and amount.
    const user = this.auth.currentUser();

    if (!user) {
      this.errorMessage.set('You must be logged in to make a withdrawal.');
      return;
    }

    const amountInCents = this.withdrawalCents;

    // Start processing and clear previous messages.
    this.isLoading.set(true);
    this.errorMessage.set('');

    // Prevent closing the dialog while processing.
    this.dialogRef.disableClose = true;

    this.transactions.withdraw({ amountInCents }).subscribe({
      next: transaction => {
        this.auth.updateBalance(user.username, this.currentBalance() - amountInCents);
        this.isLoading.set(false);
        this.toast.show('Withdraw Successful.');
        this.dialogRef.close(transaction);
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.isLoading.set(false);
        this.dialogRef.disableClose = false;
        this.errorMessage.set(
          err.error?.message ?? err.message ?? 'Withdraw Failed.');
      }
    });
  }
}
