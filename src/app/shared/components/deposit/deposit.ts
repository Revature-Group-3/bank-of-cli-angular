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

@Component({
  selector: 'app-deposit',
  imports: [
    NumericInputDirective,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    CentsIntegerToDollarStringPipe
  ],
  templateUrl: './deposit.html',
  styleUrl: './deposit.css',
  standalone: true
})
export class Deposit {
  private auth = inject(AuthService);
  private transactions = inject(TransactionService);
  private dialogRef = inject(MatDialogRef);

  // the logged-in user's real balance, in cents (0 if nobody is logged in)
  currentBalance = computed(() => this.auth.currentUser()?.balance ?? 0);

  // what the user types, in dollars (for example 19.99)
  depositAmount: number | null = null;

  // the typed amount as whole cents (19.99 becomes 1999), which is what the service expects
  get depositCents(): number {
    return Math.round((this.depositAmount ?? 0) * 100);
  }

  // the service's error message, shown under the input when a deposit is rejected
  errorMessage = signal('');

  submitDeposit() {
    const user = this.auth.currentUser();

    // if nobody is logged in, id 0 matches no account and the service returns its 401
    const result = this.transactions.deposit({
      accountId: user?.id ?? 0,
      amount: this.depositCents,
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
