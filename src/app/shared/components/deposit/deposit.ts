
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
    ProgressBar,
    CentsIntegerToDollarStringPipe,
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

  // The logged-in user's balance is stored in cents.
  currentBalance = computed(() => this.auth.currentUser()?.balance ?? 0);
  depositAmount = 0;
  isLoading = signal(false);

  get depositCents(): number {
    return Math.round(this.depositAmount * 100);
  }

  errorMessage = signal('');
  successMessage = signal('');

  submitDeposit() {
    if (this.isLoading() || this.successMessage()) {
      return;
    }

    const user = this.auth.currentUser();
    const accountId = user?.id ?? 0;
    const amount = this.depositCents;
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.dialogRef.disableClose = true;

    setTimeout(() => {
      const result = this.transactions.deposit({
        accountId,
        amount,
      });

      this.isLoading.set(false);

      if ('status' in result) {
        this.errorMessage.set(result.message);
        this.dialogRef.disableClose = false;
        return;
      }

      this.successMessage.set('Deposit successful!');

      // Allow the user to see the success message for 1 second.
      setTimeout(() => {
        this.dialogRef.close(result);
        this.router.navigate(['/dashboard']);
      }, 1000);
    }, 1000);
  }
}
