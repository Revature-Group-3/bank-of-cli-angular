import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TransactionService } from './transaction-service';
import { AuthService } from './auth-service';

describe('TransactionService', () => {
  let service: TransactionService;
  let auth: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TransactionService);
    auth = TestBed.inject(AuthService);

    // hand AuthService a fake accounts.json, then log in as that user
    TestBed.inject(HttpTestingController)
      .expectOne('/accounts.json')
      .flush([
        { id: 1, firstName: 'Hal', lastName: 'Jordan', username: 'hal@email.com', password: 'green', balance: 1500 },
        { id: 2, firstName: 'John', lastName: 'Stewart', username: 'js@email.com', password: 'lantern', balance: 320.5 },
      ]);
    auth.login('hal@email.com', 'green');
  });

  it('adds a deposit to the balance and returns the transaction', () => {
    const result = service.deposit({ accountId: 1, amount: 50 });

    expect(result).toMatchObject({ accountId: 1, type: 'DEPOSIT', amount: 50 });
    expect(auth.currentUser()?.balance).toBe(1550);
  });

  it('rejects an amount of zero or less and leaves the balance alone', () => {
    const result = service.deposit({ accountId: 1, amount: -5 });

    expect(result).toMatchObject({ status: 400 });
    expect(auth.currentUser()?.balance).toBe(1500);
  });

  it('rejects a deposit when nobody is logged in', () => {
    auth.logout();

    const result = service.deposit({ accountId: 1, amount: 50 });

    expect(result).toMatchObject({ status: 401 });
  });

  it('subtracts a withdrawal from the balance and returns the transaction', () => {
    const result = service.withdraw({ accountId: 1, amount: 200 });

    expect(result).toMatchObject({ accountId: 1, type: 'WITHDRAWAL', amount: 200 });
    expect(auth.currentUser()?.balance).toBe(1300);
  });

  it('rejects a withdrawal larger than the balance', () => {
    const result = service.withdraw({ accountId: 1, amount: 2000 });

    expect(result).toMatchObject({ status: 400 });
    expect(auth.currentUser()?.balance).toBe(1500);
  });

  it('allows withdrawing the entire balance', () => {
    const result = service.withdraw({ accountId: 1, amount: 1500 });

    expect(result).toMatchObject({ type: 'WITHDRAWAL' });
    expect(auth.currentUser()?.balance).toBe(0);
  });

  it('rejects a deposit over the limit', () => {
    const result = service.deposit({ accountId: 1, amount: 10000.01 });

    expect(result).toMatchObject({ status: 400 });
    expect(auth.currentUser()?.balance).toBe(1500);
  });

  it('allows a deposit of exactly the limit', () => {
    const result = service.deposit({ accountId: 1, amount: 10000 });

    expect(result).toMatchObject({ type: 'DEPOSIT' });
    expect(auth.currentUser()?.balance).toBe(11500);
  });

  it('moves money from the sender to the recipient and returns the transaction', () => {
    const result = service.transfer({ senderAccountId: 1, recipientAccountId: 2, amount: 100 });

    expect(result).toMatchObject({ senderAccountId: 1, recipientAccountId: 2, type: 'TRANSFER', amount: 100 });
    expect(auth.currentUser()?.balance).toBe(1400);
    expect(auth.getAccountByID(2)?.balance).toBe(420.5);
  });

  it('rejects a transfer to your own account', () => {
    const result = service.transfer({ senderAccountId: 1, recipientAccountId: 1, amount: 100 });

    expect(result).toMatchObject({ status: 400 });
    expect(auth.currentUser()?.balance).toBe(1500);
  });

  it('rejects a transfer to an account that does not exist', () => {
    const result = service.transfer({ senderAccountId: 1, recipientAccountId: 99, amount: 100 });

    expect(result).toMatchObject({ status: 404 });
    expect(auth.currentUser()?.balance).toBe(1500);
  });

  it('rejects a transfer larger than the sender balance and changes neither account', () => {
    const result = service.transfer({ senderAccountId: 1, recipientAccountId: 2, amount: 2000 });

    expect(result).toMatchObject({ status: 400 });
    expect(auth.currentUser()?.balance).toBe(1500);
    expect(auth.getAccountByID(2)?.balance).toBe(320.5);
  });

  it('rejects a transfer over the limit', () => {
    const result = service.transfer({ senderAccountId: 1, recipientAccountId: 2, amount: 10000.01 });

    expect(result).toMatchObject({ status: 400, message: expect.stringContaining('limit') });
    expect(auth.currentUser()?.balance).toBe(1500);
  });
});
