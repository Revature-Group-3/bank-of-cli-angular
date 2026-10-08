import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../services/auth-service';
import { TransactionService } from '../../../services/transaction-service';
import { CentsIntegerToDollarStringPipe } from '../../pipes/cents-integer-to-dollar-string-pipe';

@Component({
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    CentsIntegerToDollarStringPipe
  ],
  selector: 'app-transfer',
  styleUrl: './transfer.css',
  templateUrl: './transfer.html',
  standalone: true
})
export class Transfer {
  private auth = inject(AuthService);
  private transactions = inject(TransactionService);
  private dialogRef = inject(MatDialogRef);

  // the logged-in user's real balance, in cents (0 if nobody is logged in)
  currentBalance = computed(() => this.auth.currentUser()?.balance ?? 0);

  // what the user types, in dollars (for example 19.99)
  transferAmount = 0;

  // the typed amount as whole cents (19.99 becomes 1999), which is what the service expects
  get transferCents(): number {
    return Math.round(this.transferAmount * 100);
  }

  // the recipient's username, as typed by the user
  recipient = "";

  // the service's error message, shown under the inputs when a transfer is rejected
  errorMessage = signal('');

  submitTransfer() {
    const sender = this.auth.currentUser();

    // the user types a username; the contract's transfer request needs an account id
    const recipientAccount = this.auth.getAccountsByUsername(this.recipient.trim());

    // id 0 matches no account, so a missing sender or recipient is rejected by the service
    const result = this.transactions.transfer({
      senderAccountId: sender?.id ?? 0,
      recipientAccountId: recipientAccount?.id ?? 0,
      amount: this.transferCents,
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
