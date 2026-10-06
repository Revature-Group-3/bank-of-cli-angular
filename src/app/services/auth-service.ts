import { inject, Service, signal } from '@angular/core';
import { Account } from '../models/account';
import { HttpClient } from '@angular/common/http';

@Service()
export class AuthService {
  /**
   * AuthService : acts as DAO or data access object here, instead of calling REST controller.
   * A signal containing an array of accounts that acts as your "database".
   *
   * Register adds to it, login searches it.
   *
   */
  // Generic notes Can control visibility with(Encapsulation):
  /**
   * - public
   * - private
   * - protected
   */

  /**
   * Signals: A signal is a reactive primitive used for state management
   * that automatically tracks where it is used and notifies subscribers
   * when its value changes.
   */


  // Accounts Property -  a signal holding an array of accounts that starts empty.
  // Private : means only this service(AuthService) can touch it.
  // accounts: is the property name
  // = : assigns the value
  // signal<Account[]>([]): creates a signal holding an array of Account, starting empty.
  // <Account[]>: an array of Account
  // ([]) : is the initial value, passed as the argument: an empty array.
  private accounts = signal<Account[]>([]);

  // login function()
  // A signal for whos logged in
  currentUser = signal<Account | null>(null);

  // For testing dummy data :json
  // Inject httpClient
  private http = inject(HttpClient);

  // 1. Constructors in TypeScript are always named constructor, not the class name:
  constructor(){
    this.http.get<Account[]>('/accounts.json')
    .subscribe(data => this.accounts.set(data));

    /**
     * 2. .subscribe() needs a callback saying what to do once the data arrives.
     * Here, data is the array of accounts from the file, and you .set() it into your signal.
     * HTTP calls are asynchronous: the request goes out, and the callback runs whenever the
     * response comes back, like a listener.
     *
     * Also make sure HttpClient is imported from @angular/common/http
     */
  }

  // ': Account | null' means of type account or null to return when this function is called.
  // Omit : a typescript utility type, that creates a new type by taking an existing type and removing some fields.
  // in this case the 'id' field is removed
  public register(account: Omit<Account, 'id'>): Account | null {
    // 1. Get current list
    const current = this.accounts();

    // Check if account already exists by matching on username:
    // .some() goes through the array and returns true if any
    // account matches the condition.
    const exists = current.some(a => a.username === account.username);
    if (exists){return null;}

    // 2. Figure out the nxt id
    // - if current is empty -> 1
    // - otherwise -> highest id(also latest generated id) + 1

    // let next id be of type number
    let nextId : number;

    // check if list is empty
    if (current.length === 0){
      nextId = 1;
    }else{
      /**
       * .map: JavaScript arrays have it built in, so there's no .stream()
       * before it or .collect() after. It returns a new array directly.
       *
       * Arrow functions: a => a.id in TypeScript, a -> a.getId() in Java. Same idea.
       *
       * Math.max: Java's only takes two numbers. JavaScript's takes any number of them,
       * which is why the spread ...ids works. In Java you'd reach for stream().max() instead.
       *
       * Spread Syntax: ...
       * for ex: (...ids)
       * "spreads ids out". Formal def: it takes a collection and lays its items out individually.
       * Works in calls, arrays, adn objects.
       */
      const ids = current.map(a => a.id); // [1,2,5] -> just the ids mapped out
      nextId = Math.max(...ids) + 1;    // highest id + 1
    }

    // 3. Build the new account : the passed
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
    /**
     *
     * This gets the accounts list and adds a new account, by first spreading
     * out the accounts represented as an array of accounts, then adding the
     * new account after it, hence why theres a comma and the new account next to it.
     */
    this.accounts.update(accounts => [...accounts, newAccount]);

    // Temporary log result for testing purposes.
    console.log('All accounts:', this.accounts());

    return newAccount;

  }


  /**
   * 1. We need to get account from accounts list.
   * 2. we need to match it with login credentials that the user inputs in some sort of field.
   *
   * So this function should take in:
   * - login creds: username and password. typically extracted from a form.
   *
   * And we can use the list of accounts in this service.
   *
   * Return: Return Account, and handoff + redirect to dashboard.
   */

  public login(username: string, password: string): Account | null{

    // 1. get current Accounts
    const currentAccounts = this.accounts();

    // Check if account already exists by matching on username:
    const userExists = currentAccounts.find(u => u.username === username && u.password === password);

    if(userExists){
      this.currentUser.set(userExists);
      return userExists;
    }else{
      return null;
    }

  }

  public logout(): void {
    this.currentUser.set(null);
  }


}
