import { inject, Injectable, signal } from '@angular/core';

import { AuthService } from './auth-service';
import {
  ApiService,
  ApiTransferRequest,
  ApiTransferResponse
} from './http-client-service';
import { ApiError } from '../models/api-error';
import {
  DepositRequest,
  RecentTransactionsResponse,
  StandardTransaction,
  Transaction,
  WithdrawalRequest,
} from '../models/transaction';
import { Observable, throwError } from 'rxjs';

// all money in this service is in whole cents: 1999 means $19.99
// the most that can be deposited or transferred in a single transaction: $10,000.00
export const MAX_TRANSACTION_AMOUNT = 1_000_000;

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  // gives this service access to the logged-in user and the accounts
  private auth = inject(AuthService);
  private api = inject(ApiService);


  // every transaction made this session; stands in for the transactions table
  private transactions = signal<Transaction[]>([]);

  private observableError(status: number, message: string): Observable<never> {
    return throwError(() => ({ status, message, timestamp: new Date().toISOString() } satisfies ApiError));
  }

  deposit(request: DepositRequest): Observable<StandardTransaction> {

    // rule: the amount must be a whole number of cents, above zero
    if (!Number.isInteger(request.amountInCents) || request.amountInCents <= 0) {
      return this.observableError(400, 'The transaction amount must be greater than zero.');
    }

    // rule: a single deposit cannot exceed the limit
    if (request.amountInCents > MAX_TRANSACTION_AMOUNT) {
      return this.observableError(400, 'The deposit/transfer amount exceeds the maximum allowed limit of $10,000.');
    }

    return this.api.deposit(request);
  }

  withdraw(request: WithdrawalRequest): Observable<StandardTransaction> {

    // rule: the amount must be a whole number of cents, above zero
    if (!Number.isInteger(request.amountInCents) || request.amountInCents <= 0) {
      return this.observableError(400, 'The transaction amount must be greater than zero.');
    }

    return this.api.withdraw(request);
  }

  transfer(
    request: ApiTransferRequest
  ): Observable<ApiTransferResponse> {
    // rule: you can only send from the account you are logged in to
    // The backend must identify and authorize the sender through authentication.

    // rule: the amount must be a whole number of cents, above zero
    // The backend validates amountInCents.

    // rule: a single transfer cannot exceed the limit
    // The backend enforces the transfer limit.

    // rule: you cannot send money to yourself
    // The backend validates the recipient against the authenticated sender.

    // rule: the recipient has to be a real account
    // The backend checks its database instead of the mock account list.

    // rule: you cannot send more than you have
    // The backend checks the current database balance.

    // every rule passed: take from the sender, give to the recipient
    // The backend must perform both balance updates atomically.
    return this.api.transfer(request);
  }

  getRecentTransactions(): Observable<RecentTransactionsResponse> {
    return this.api.getTransactions();
  }

  // builds an error shaped like the contract's unsuccessful responses
  private error(status: number, message: string): ApiError {
    return { status, message, timestamp: new Date().toISOString() };
  }
}