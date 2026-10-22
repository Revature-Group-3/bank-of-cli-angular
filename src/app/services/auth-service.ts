import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { Account } from '../models/account';
import {
  ApiService,
  LoginResponse,
  RegisterRequest
} from './http-client-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /**
   * AuthService : acts as DAO or data access object here, instead of calling a REST controller.
   * A signal containing an array of accounts that acts as your "database".
   *
   * Register adds to it, login searches it.
   *
   */

  // Accounts Property -  a signal holding an array of accounts that starts empty.
  // Private : Only this service(AuthService) can touch it.
  // signal<Account[]>([]): creates a signal holding an array of Account, starting empty.
  // <Account[]>: an array of Account
  // ([]) : is the initial value, passed as the argument: an empty array.
  private accounts = signal<Account[]>([]);

  // login function() property
  // A signal to keep track of login state
  currentUser = signal<Omit<Account, 'password'> | null>(null);

  private token = signal<string | null>(null);

  // For testing dummy data :json
  // Inject httpClient: make sure HttpClient is imported from @angular/common/http
  // HTTP requests now go through ApiService.
  private api = inject(ApiService);

  constructor() {
    // .subscribe() needs a callback saying what to do once the data arrives.
    this.api.getMockAccounts().subscribe({
      next: data => this.accounts.set(data),
      error: () => {
        console.warn('[AuthService] Mock accounts could not be loaded.');
      }
    });

    // TEMPORARY LOCAL TESTING — remove before committing.
    this.currentUser.set({
      id: 1,
      firstName: 'Test',
      lastName: 'User',
      username: 'test@example.com',
      balance: 150000
    });
  }

  // TEMPORARY LOCAL TESTING — remove before committing.

  /* .find() returns either the matching account or undefined, so the return type
   * is Account | undefined:
   * If recipient doesn't exist, undefined is returned
   */
  public getAccountsByUsername(username: string): Account | undefined {
    return this.accounts().find(u => u.username === username);
  }

  public getAccountByID(id: number): Account | undefined {
    return this.accounts().find(a => a.id === id);
  }

  /**
   * Get the account by its username and set the new balance to the amount.
   * @param username Used to retrieve a specific account by this username
   * @param amount Account's new set balance
   */
  public updateBalance(username: string, amount: number): void {
    // 1. Replace the matching account with the updated copy
    //
    this.accounts.update(list =>
      list.map(a => a.username === username ? { ...a, balance: amount } : a)
    );

    // 2. Keep currentUser in sync if it's the logged-in account
    if (this.currentUser()?.username == username) {
      this.currentUser.set(this.getAccountsByUsername(username) ?? null);
    }
  }

  // ': Account | null' means of type account or null to return when this function is called.
  // Omit : a typescript utility type, that creates a new type by taking an existing type and removing some fields.
  // in this case the 'id' field is removed
  public register(request: RegisterRequest): Observable<unknown> {
    // The preserved comments below describe the previous mock implementation.
    // The backend now handles account creation, duplicate checks, and IDs.

    // 1. Get current list

    // Check if account already exists by matching on username:
    // .some() goes through the array and returns true if any
    // account matches the condition.ååå

    // 2. Figure out the next id (nextId)
    // - if current is empty -> 1
    // - otherwise -> highest id(also latest generated id) + 1

    // Check if list is empty

    // 3. Build the new account
    /**
     * Here , newAccount is  matching this format :
        export interface Account {
          id: nextId;
          firstName: string;
          lastName:string;
          username:string;
          password:string;
          balance: number;
        }
          Then.....
     */

    // 4. Add it to the signal (return a NEW array, don't push)
    // Updates the accounts list by adding a new account.

    // Temporary log result for testing purposes.
    // Account logging removed to avoid exposing passwords.

    return this.api.register(request);
  }

  /**
   * login()
   * 1. Get account from accounts list.
   * 2. Match with login credentials account holder inputs in some sort of field.
   *
   * Potential parameters:
   * - username
   * - password
   *
   * Return: Account, and handoff + redirect to dashboard.
   */

  public login(
    email: string,
    password: string
  ): Observable<LoginResponse> {

    // 1. get current Accounts
    // Login now requests authentication from the backend.

    // Check if account already exists:
    return this.api.login({ email, password }).pipe(
      tap(response => {
        this.token.set(response.token);
      })
    );
  }

  public getToken(): string | null {
    return this.token();
  }

  // Logout option when account holder is logged in
  public logout(): void {
    this.token.set(null);
    this.currentUser.set(null);
  }
}