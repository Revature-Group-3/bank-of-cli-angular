import { Component } from '@angular/core';
import { signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-transaction-center',
  styleUrl: './transaction-center.css',
  templateUrl: './transaction-center.html',
})
export class TransactionCenter {
  amount = signal('');
  toAccount = signal('');
  message = signal('');
  subMessage = signal('');

  onTransfer() {
    const amount = this.amount();
    const toAccount = this.toAccount();

    // Implement the transfer logic here
    if (!amount || !toAccount) {
      this.message.set("Amount and recipient account are required.");
      return;
    } else if (Number(amount) <= 0) {
      this.message.set("Amount must be greater than zero.");
      return;
    }
    console.log(`Transferring ${amount} to account ${toAccount}`);
  }
}
