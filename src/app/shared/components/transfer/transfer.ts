import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AuthService } from '../../../services/auth-service';
import { TransactionService } from '../../../services/transaction-service';
import { CentsIntegerToDollarStringPipe } from '../../pipes/cents-integer-to-dollar-string-pipe';
import { ProgressBar } from '../../../progress-bar/progress-bar';

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
  selector: 'app-transfer',
  styleUrl: './transfer.css',
  templateUrl: './transfer.html',
  standalone: true,
})
export class Transfer {
  private auth = inject(AuthService);
  private transactions = inject(TransactionService);
  private dialogRef = inject(MatDialogRef);

  currentBalance = computed(() => this.auth.currentUser()?.balance ?? 0);
  transferAmount = 0;
  recipient = '';
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  get transferCents(): number {
    return Math.round(this.transferAmount * 100);
  }

  submitTransfer() {
    if (this.isLoading() || this.successMessage()) {
      return;
    }

    const sender = this.auth.currentUser();
    const recipientUsername = this.recipient.trim();
    const amount = this.transferCents;
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.dialogRef.disableClose = true;

    setTimeout(() => {
      const recipientAccount =
        this.auth.getAccountsByUsername(recipientUsername);
      const result = this.transactions.transfer({
        senderAccountId: sender?.id ?? 0,
        recipientAccountId: recipientAccount?.id ?? 0,
        amount,
      });
      this.isLoading.set(false);

      if ('status' in result) {
        this.errorMessage.set(result.message);
        this.dialogRef.disableClose = false;
        return;
      }

      this.successMessage.set('Transfer successful!');
      setTimeout(() => this.dialogRef.close(result), 1000);
    }, 1000);
  }
}
