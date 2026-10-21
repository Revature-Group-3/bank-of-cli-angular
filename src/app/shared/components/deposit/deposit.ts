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
  private toast = inject(ToastService);

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

  submitDeposit() {

    // Prevent duplicate submissions.
    if (this.isLoading()) {
      return;
    }

    // Save the submitted account and amount.
    const user = this.auth.currentUser();

    // makes sure user is not null
    if (!user) {
      this.errorMessage.set('You must be logged in to make a deposit.');
      return;
    }
    const amountInCents = this.depositCents;

    // Start loading and clear previous messages.
    this.isLoading.set(true);
    this.errorMessage.set('');

    // Prevent closing the dialog during processing.
    this.dialogRef.disableClose = true;

    this.transactions.deposit({ amountInCents }).subscribe({
      next: transaction => {
        this.auth.updateBalance(user.username, this.currentBalance() + amountInCents);
        this.isLoading.set(false);
        this.toast.show('Deposit Successful.');
        this.dialogRef.close(transaction);
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.isLoading.set(false);
        this.dialogRef.disableClose = false;
        this.errorMessage.set(
          err.error?.message ?? err.message ?? 'Deposit Failed.');
      }
    });
  }
}
