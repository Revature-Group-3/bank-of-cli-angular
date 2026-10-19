import { inject, Service, signal } from '@angular/core';
import { AuthService } from './auth-service';
import { ApiError } from '../models/api-error';
import { ApiService } from '../services/http-client-service';
import {
  DepositRequest,
  RecentTransactionsResponse,
  StandardTransaction,
  Transaction,
  TransferRequest,
  TransferTransaction,
  WithdrawalRequest,
} from '../models/transaction';
import { Observable, throwError } from 'rxjs';

// all money in this service is in whole cents: 1999 means $19.99
// the most that can be deposited or transferred in a single transaction: $10,000.00
export const MAX_TRANSACTION_AMOUNT = 1_000_000;

@Service()
export class TransactionService {
  // gives this service access to the logged-in user and the accounts
  private auth = inject(AuthService);
  private api = inject(ApiService);

  // every transaction made this session; stands in for the transactions table
  private transactions = signal<Transaction[]>([]);

  private observableError(status: number, message: string): Observable<never> {
    return throwError(() => ({status, message,timestamp: new Date().toISOString()} satisfies ApiError));
  }

  deposit(request: DepositRequest): Observable<StandardTransaction> {

    // rule: the amount must be a whole number of cents, above zero
    if (!Number.isInteger(request.amount) || request.amount <= 0) {
      return this.observableError(400, 'The transaction amount must be greater than zero.');
    }

    // rule: a single deposit cannot exceed the limit
    if (request.amount > MAX_TRANSACTION_AMOUNT) {
      return this.observableError(400, 'The deposit/transfer amount exceeds the maximum allowed limit of $10,000.');
    }

    return this.api.deposit(request);
  }

  withdraw(request: WithdrawalRequest): Observable<StandardTransaction> {

    // rule: the amount must be a whole number of cents, above zero
    if (!Number.isInteger(request.amount) || request.amount <= 0) {
      return this.observableError(400, 'The transaction amount must be greater than zero.');
    }

    return this.api.withdraw(request);
  }

  transfer(request: TransferRequest): TransferTransaction | ApiError {
    const sender = this.auth.currentUser();

    // rule: you can only send from the account you are logged in to
    if (!sender || sender.id !== request.senderAccountId) {
      return this.error(401, 'You must be logged in to make a transaction.');
    }

    // rule: the amount must be a whole number of cents, above zero
    if (!Number.isInteger(request.amount) || request.amount <= 0) {
      return this.error(400, 'The transaction amount must be greater than zero.');
    }

    // rule: a single transfer cannot exceed the limit
    if (request.amount > MAX_TRANSACTION_AMOUNT) {
      return this.error(400, 'The deposit/transfer amount exceeds the maximum allowed limit of $10,000.');
    }

    // rule: you cannot send money to yourself
    if (request.recipientAccountId === sender.id) {
      return this.error(400, 'You cannot transfer funds to your own account.');
    }

    // rule: the recipient has to be a real account
    const recipient = this.auth.getAccountByID(request.recipientAccountId);
    if (!recipient) {
      return this.error(404, 'The recipient account could not be found.');
    }

    // rule: you cannot send more than you have
    if (request.amount > sender.balance) {
      return this.error(400, 'Insufficient funds. The withdrawal/transfer amount exceeds your available balance.');
    }

    // every rule passed: take from the sender, give to the recipient
    this.auth.updateBalance(sender.username, sender.balance - request.amount);
    this.auth.updateBalance(recipient.username, recipient.balance + request.amount);

    const transaction: TransferTransaction = {
      id: this.transactions().length + 1,
      senderAccountId: sender.id,
      recipientAccountId: recipient.id,
      type: 'TRANSFER',
      amount: request.amount,
      timestamp: new Date().toISOString(),
    };

    this.transactions.update(list => [...list, transaction]);
    return transaction;
  }

  getRecentTransactions(): Observable<RecentTransactionsResponse> {
    return this.api.getTransactions();
  }

  // builds an error shaped like the contract's unsuccessful responses
  private error(status: number, message: string): ApiError {
    return { status, message, timestamp: new Date().toISOString() };
  }
}
