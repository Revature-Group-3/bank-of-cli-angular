import { inject, Service, signal } from '@angular/core';
import { AuthService } from './auth-service';
import { ApiError } from '../models/api-error';
import { DepositRequest, StandardTransaction, Transaction, WithdrawalRequest } from '../models/transaction';
@Service()
export class TransactionService {
  // gives this service access to the logged-in user and the accounts
  private auth = inject(AuthService);

  // every transaction made this session; stands in for the transactions table
  private transactions = signal<Transaction[]>([]);

  deposit(request: DepositRequest): StandardTransaction | ApiError {
    const account = this.auth.currentUser();

    // rule: you can only deposit into the account you are logged in to
    if (!account || account.id !== request.accountId) {
      return this.error(401, 'You must be logged in to make a transaction.');
    }

    // rule: the amount must be a real number above zero
    if (!(request.amount > 0)) {
      return this.error(400, 'The transaction amount must be greater than zero.');
    }

    // do the math here, then hand AuthService the new balance
    this.auth.updateBalance(account.username, account.balance + request.amount);

    // build the record, shaped like the contract's deposit response
    const transaction: StandardTransaction = {
      id: this.transactions().length + 1,
      accountId: account.id,
      type: 'DEPOSIT',
      amount: request.amount,
      timestamp: new Date().toISOString(),
    };

    this.transactions.update(list => [...list, transaction]);
    return transaction;
  }

  withdraw(request: WithdrawalRequest): StandardTransaction | ApiError {
    const account = this.auth.currentUser();

    // rule: you can only withdraw from the account you are logged in to
    if (!account || account.id !== request.accountId) {
      return this.error(401, 'You must be logged in to make a transaction.');
    }

    // rule: the amount must be a real number above zero
    if (!(request.amount > 0)) {
      return this.error(400, 'The transaction amount must be greater than zero.');
    }

    // rule: you cannot take out more than you have
    if (request.amount > account.balance) {
      return this.error(400, 'Insufficient funds. The withdrawal/transfer amount exceeds your available balance.');
    }

    this.auth.updateBalance(account.username, account.balance - request.amount);

    const transaction: StandardTransaction = {
      id: this.transactions().length + 1,
      accountId: account.id,
      type: 'WITHDRAWAL',
      amount: request.amount,
      timestamp: new Date().toISOString(),
    };

    this.transactions.update(list => [...list, transaction]);
    return transaction;
  }

  // builds an error shaped like the contract's unsuccessful responses
  private error(status: number, message: string): ApiError {
    return { status, message, timestamp: new Date().toISOString() };
  }
}
