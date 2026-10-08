import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../services/auth-service';
import { TransactionService } from '../../../services/transaction-service';

@Component({
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule
  ],
  selector: 'app-withdraw',
  styleUrl: './withdraw.css',
  templateUrl: './withdraw.html',
  standalone: true
})
export class Withdraw {
  private auth = inject(AuthService);
  private transactions = inject(TransactionService);
  private dialogRef = inject(MatDialogRef);

  // the logged-in user's real balance (0 if nobody is logged in)
  currentBalance = computed(() => this.auth.currentUser()?.balance ?? 0);
  withdrawalAmount = 0;

  // the service's error message, shown under the input when a withdrawal is rejected
  errorMessage = signal('');

  submitWithdrawal() {
    const user = this.auth.currentUser();

    // if nobody is logged in, id 0 matches no account and the service returns its 401
    const result = this.transactions.withdraw({
      accountId: user?.id ?? 0,
      amount: this.withdrawalAmount,
    });

    // an ApiError has a status; a successful transaction does not
    if ('status' in result) {
      this.errorMessage.set(result.message);
      return;
    }

    // success: close the dialog and hand the transaction back to whoever opened it
    this.dialogRef.close(result);
  }
}
