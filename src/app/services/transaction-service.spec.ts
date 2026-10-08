import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TransactionService } from './transaction-service';
import { AuthService } from './auth-service';

// all money in these tests is in whole cents: 150000 means $1,500.00
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
        { id: 1, firstName: 'Hal', lastName: 'Jordan', username: 'hal@email.com', password: 'green', balance: 150000 },
        { id: 2, firstName: 'John', lastName: 'Stewart', username: 'js@email.com', password: 'lantern', balance: 32050 },
      ]);
    auth.login('hal@email.com', 'green');
  });

  it('adds a deposit to the balance and returns the transaction', () => {
    const result = service.deposit({ accountId: 1, amount: 5000 });

    expect(result).toMatchObject({ accountId: 1, type: 'DEPOSIT', amount: 5000 });
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

    expect(result).toMatchObject({ accountId: 1, type: 'WITHDRAWAL', amount: 20000 });
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
    const result = service.deposit({ accountId: 1, amount: 1000001 });

    expect(result).toMatchObject({ status: 400, message: expect.stringContaining('limit') });
    expect(auth.currentUser()?.balance).toBe(150000);
  });

  it('allows a deposit of exactly the limit', () => {
    const result = service.deposit({ accountId: 1, amount: 1000000 });

    expect(result).toMatchObject({ type: 'DEPOSIT' });
    expect(auth.currentUser()?.balance).toBe(1150000);
  });

  it('moves money from the sender to the recipient and returns the transaction', () => {
    const result = service.transfer({ senderAccountId: 1, recipientAccountId: 2, amount: 10000 });

    expect(result).toMatchObject({ senderAccountId: 1, recipientAccountId: 2, type: 'TRANSFER', amount: 10000 });
    expect(auth.currentUser()?.balance).toBe(140000);
    expect(auth.getAccountByID(2)?.balance).toBe(42050);
  });

  it('rejects a transfer to your own account', () => {
    const result = service.transfer({ senderAccountId: 1, recipientAccountId: 1, amount: 10000 });

    expect(result).toMatchObject({ status: 400 });
    expect(auth.currentUser()?.balance).toBe(150000);
  });

  it('rejects a transfer to an account that does not exist', () => {
    const result = service.transfer({ senderAccountId: 1, recipientAccountId: 99, amount: 10000 });

    expect(result).toMatchObject({ status: 404 });
    expect(auth.currentUser()?.balance).toBe(150000);
  });

  it('rejects a transfer larger than the sender balance and changes neither account', () => {
    const result = service.transfer({ senderAccountId: 1, recipientAccountId: 2, amount: 200000 });

    expect(result).toMatchObject({ status: 400 });
    expect(auth.currentUser()?.balance).toBe(150000);
    expect(auth.getAccountByID(2)?.balance).toBe(32050);
  });

  it('rejects a transfer over the limit', () => {
    const result = service.transfer({ senderAccountId: 1, recipientAccountId: 2, amount: 1000001 });

    expect(result).toMatchObject({ status: 400, message: expect.stringContaining('limit') });
    expect(auth.currentUser()?.balance).toBe(150000);
  });

  it("lists the logged-in account's transactions, newest first", () => {
    service.deposit({ accountId: 1, amount: 5000 });
    service.withdraw({ accountId: 1, amount: 2000 });
    service.transfer({ senderAccountId: 1, recipientAccountId: 2, amount: 10000 });

    const result = service.getRecentTransactions(1);

    expect(result).toMatchObject({
      transactions: [{ type: 'TRANSFER' }, { type: 'WITHDRAWAL' }, { type: 'DEPOSIT' }],
    });
  });

  it("shows a transfer to the recipient too, but not the sender's other transactions", () => {
    service.deposit({ accountId: 1, amount: 5000 });
    service.transfer({ senderAccountId: 1, recipientAccountId: 2, amount: 10000 });
    auth.logout();
    auth.login('js@email.com', 'lantern');

    const result = service.getRecentTransactions(2);

    expect(result).toEqual({
      transactions: [expect.objectContaining({ type: 'TRANSFER', recipientAccountId: 2 })],
    });
  });

  it("rejects a request for another account's transactions", () => {
    const result = service.getRecentTransactions(2);

    expect(result).toMatchObject({ status: 401 });
  });
});
