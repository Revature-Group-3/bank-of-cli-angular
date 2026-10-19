import { TestBed } from '@angular/core/testing';
import {
  HttpErrorResponse,
  provideHttpClient
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import { TransactionService } from './transaction-service';
import { AuthService } from './auth-service';
import {
  ApiService,
  ApiTransferResponse
} from './http-client-service';

// all money in these tests is in whole cents: 150000 means $1,500.00
describe('TransactionService', () => {
  let service: TransactionService;
  let auth: AuthService;
  let httpTesting: HttpTestingController;
  let transferUrl: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ],
    });

    httpTesting = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TransactionService);
    auth = TestBed.inject(AuthService);

    transferUrl = `${TestBed.inject(ApiService).apiUrl}/transfers`;

    // hand AuthService a fake accounts.json, then log in as that user
    httpTesting.expectOne('/accounts.json').flush([
      {
        id: 1,
        firstName: 'Hal',
        lastName: 'Jordan',
        username: 'hal@email.com',
        password: 'green',
        balance: 150000
      },
      {
        id: 2,
        firstName: 'John',
        lastName: 'Stewart',
        username: 'js@email.com',
        password: 'lantern',
        balance: 32050
      }
    ]);

    // Set component-facing authentication state directly.
    // Login HTTP behavior belongs in separate authentication tests.
    auth.currentUser.set({
      id: 1,
      firstName: 'Hal',
      lastName: 'Jordan',
      username: 'hal@email.com',
      balance: 150000
    });
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('adds a deposit to the balance and returns the transaction', () => {
    const result = service.deposit({ accountId: 1, amount: 5000 });

    expect(result).toMatchObject({
      accountId: 1,
      type: 'DEPOSIT',
      amount: 5000
    });
    expect(auth.currentUser()?.balance).toBe(155000);
  });

  it('rejects an amount of zero or less and leaves the balance alone', () => {
    const result = service.deposit({ accountId: 1, amount: -500 });

    expect(result).toMatchObject({ status: 400 });
    expect(auth.currentUser()?.balance).toBe(150000);
  });

  it('rejects an amount that is not a whole number of cents', () => {
    const result = service.deposit({ accountId: 1, amount: 50.5 });

    expect(result).toMatchObject({ status: 400 });
    expect(auth.currentUser()?.balance).toBe(150000);
  });

  it('rejects a deposit when nobody is logged in', () => {
    auth.logout();

    const result = service.deposit({ accountId: 1, amount: 5000 });

    expect(result).toMatchObject({ status: 401 });
  });

  it('subtracts a withdrawal from the balance and returns the transaction', () => {
    const result = service.withdraw({ accountId: 1, amount: 20000 });

    expect(result).toMatchObject({
      accountId: 1,
      type: 'WITHDRAWAL',
      amount: 20000
    });
    expect(auth.currentUser()?.balance).toBe(130000);
  });

  it('rejects a withdrawal larger than the balance', () => {
    const result = service.withdraw({ accountId: 1, amount: 200000 });

    expect(result).toMatchObject({ status: 400 });
    expect(auth.currentUser()?.balance).toBe(150000);
  });

  it('allows withdrawing the entire balance', () => {
    const result = service.withdraw({ accountId: 1, amount: 150000 });

    expect(result).toMatchObject({ type: 'WITHDRAWAL' });
    expect(auth.currentUser()?.balance).toBe(0);
  });

  it('rejects a deposit over the limit', () => {
    const result = service.deposit({
      accountId: 1,
      amount: 1000001
    });

    expect(result).toMatchObject({
      status: 400,
      message: expect.stringContaining('limit')
    });
    expect(auth.currentUser()?.balance).toBe(150000);
  });

  it('allows a deposit of exactly the limit', () => {
    const result = service.deposit({
      accountId: 1,
      amount: 1000000
    });

    expect(result).toMatchObject({ type: 'DEPOSIT' });
    expect(auth.currentUser()?.balance).toBe(1150000);
  });

  it('posts the transfer request and returns the backend transaction', () => {
    const payload = {
      recipientAccountEmail: 'js@email.com',
      amountInCents: 10000
    };

    const response: ApiTransferResponse = {
      id: 51,
      senderAccountEmail: 'hal@email.com',
      recipientAccountEmail: 'js@email.com',
      type: 'TRANSFER',
      amountInCents: 10000,
      timestamp: '2026-10-19T19:00:00Z'
    };

    let received: ApiTransferResponse | undefined;

    service.transfer(payload).subscribe(result => {
      received = result;
    });

    const request = httpTesting.expectOne(transferUrl);

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(payload);

    request.flush(response);

    expect(received).toEqual(response);

    // The frontend no longer calculates transfer balances.
    expect(auth.currentUser()?.balance).toBe(150000);
    expect(auth.getAccountByID(2)?.balance).toBe(32050);
  });

  it('passes backend transfer errors to the caller', () => {
    const scenarios = [
      {
        recipientAccountEmail: 'hal@email.com',
        amountInCents: 10000,
        status: 400,
        statusText: 'Bad Request',
        message: 'You cannot transfer funds to your own account.'
      },
      {
        recipientAccountEmail: 'missing@email.com',
        amountInCents: 10000,
        status: 404,
        statusText: 'Not Found',
        message: 'The recipient account could not be found.'
      },
      {
        recipientAccountEmail: 'js@email.com',
        amountInCents: 200000,
        status: 400,
        statusText: 'Bad Request',
        message: 'Insufficient funds.'
      },
      {
        recipientAccountEmail: 'js@email.com',
        amountInCents: 1000001,
        status: 400,
        statusText: 'Bad Request',
        message: 'The transfer amount exceeds the maximum allowed limit.'
      }
    ];

    for (const scenario of scenarios) {
      let receivedError: HttpErrorResponse | undefined;
      let succeeded = false;

      service.transfer({
        recipientAccountEmail: scenario.recipientAccountEmail,
        amountInCents: scenario.amountInCents
      }).subscribe({
        next: () => {
          succeeded = true;
        },
        error: (error: HttpErrorResponse) => {
          receivedError = error;
        }
      });

      const request = httpTesting.expectOne(transferUrl);

      request.flush(
        {
          status: scenario.status,
          message: scenario.message,
          timestamp: '2026-10-19T19:00:00Z'
        },
        {
          status: scenario.status,
          statusText: scenario.statusText
        }
      );

      expect(succeeded).toBe(false);
      expect(receivedError?.status).toBe(scenario.status);
      expect(receivedError?.error.message).toBe(scenario.message);
      expect(auth.currentUser()?.balance).toBe(150000);
      expect(auth.getAccountByID(2)?.balance).toBe(32050);
    }
  });

  it("lists the logged-in account's mock transactions, newest first", () => {
    service.deposit({ accountId: 1, amount: 5000 });
    service.withdraw({ accountId: 1, amount: 2000 });

    const result = service.getRecentTransactions(1);

    expect(result).toMatchObject({
      transactions: [
        { type: 'WITHDRAWAL' },
        { type: 'DEPOSIT' }
      ],
    });
  });

  it("does not include the sender's mock transactions for another account", () => {
    service.deposit({ accountId: 1, amount: 5000 });

    auth.logout();
    auth.currentUser.set({
      id: 2,
      firstName: 'John',
      lastName: 'Stewart',
      username: 'js@email.com',
      balance: 32050
    });

    const result = service.getRecentTransactions(2);

    expect(result).toEqual({
      transactions: []
    });
  });

  it("rejects a request for another account's transactions", () => {
    const result = service.getRecentTransactions(2);

    expect(result).toMatchObject({ status: 401 });
  });
});