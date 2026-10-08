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
    ProgressBar,
    CentsIntegerToDollarStringPipe,
  ],
  selector: 'app-withdraw',
  styleUrl: './withdraw.css',
  templateUrl: './withdraw.html',
  standalone: true,
})
export class Withdraw {
  private auth = inject(AuthService);
  private transactions = inject(TransactionService);
  private dialogRef = inject(MatDialogRef);

  currentBalance = computed(() => this.auth.currentUser()?.balance ?? 0);
  withdrawalAmount = 0;
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  get withdrawalCents(): number {
    return Math.round(this.withdrawalAmount * 100);
  }

  submitWithdrawal() {
    if (this.isLoading() || this.successMessage()) {
      return;
    }

    const user = this.auth.currentUser();
    const accountId = user?.id ?? 0;
    const amount = this.withdrawalCents;
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.dialogRef.disableClose = true;

    setTimeout(() => {
      const result = this.transactions.withdraw({ accountId, amount });
      this.isLoading.set(false);

      if ('status' in result) {
        this.errorMessage.set(result.message);
        this.dialogRef.disableClose = false;
        return;
      }

      this.successMessage.set('Withdrawal successful!');
      setTimeout(() => this.dialogRef.close(result), 1000);
    }, 1000);
  }
}
