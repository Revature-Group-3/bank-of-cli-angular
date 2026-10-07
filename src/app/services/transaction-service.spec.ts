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
});
