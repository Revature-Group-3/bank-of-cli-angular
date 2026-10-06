import { inject, Service, signal } from '@angular/core';
import { Account } from '../models/account';
import { HttpClient } from '@angular/common/http';

@Service()
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
  currentUser = signal<Account | null>(null);

  // For testing dummy data :json
  // Inject httpClient: make sure HttpClient is imported from @angular/common/http
  private http = inject(HttpClient);


  constructor(){
    // .subscribe() needs a callback saying what to do once the data arrives.
    this.http.get<Account[]>('/accounts.json')
    .subscribe(data => this.accounts.set(data));
  }

  // ': Account | null' means of type account or null to return when this function is called.
  // Omit : a typescript utility type, that creates a new type by taking an existing type and removing some fields.
  // in this case the 'id' field is removed
  public register(account: Omit<Account, 'id'>): Account | null {
    // 1. Get current list
    const current = this.accounts();

    // Check if account already exists by matching on username:
    // .some() goes through the array and returns true if any
    // account matches the condition.ååå
    const exists = current.some(a => a.username === account.username);
    if (exists){return null;}

    // 2. Figure out the next id (nextId)
    // - if current is empty -> 1
    // - otherwise -> highest id(also latest generated id) + 1
    let nextId : number;

    // Check if list is empty
    if (current.length === 0){
      nextId = 1;
    }else{
      const ids = current.map(a => a.id); // [1,2,5] -> just the ids mapped out
      nextId = Math.max(...ids) + 1;    // highest id + 1
    }

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
    const newAccount: Account = { ...account, id: nextId}

    // 4. Add it to the signal (return a NEW array, don't push)
    // Updates the accounts list by adding a new account.
    this.accounts.update(accounts => [...accounts, newAccount]);

    // Temporary log result for testing purposes.
    console.log('All accounts:', this.accounts());

    return newAccount;

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

  public login(username: string, password: string): Account | null{

    // 1. get current Accounts
    const currentAccounts = this.accounts();

    // Check if account already exists:
    const userExists = currentAccounts.find(u => u.username === username && u.password === password);

    if(userExists){
      this.currentUser.set(userExists);
      return userExists;
    }else{
      return null;
    }

  }

  // Logout option when account holder is logged in
  public logout(): void {
    this.currentUser.set(null);
  }

}
