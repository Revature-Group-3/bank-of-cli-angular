import { Service, signal } from '@angular/core';
import { Account } from '../models/account';

@Service()
export class AuthService {
  /**
   * AuthService : acts as DAO or data access object here, instead of calling REST controller.
   * A signal containing an array of accounts that acts as your "database".
   *
   * Register adds to it, login searches it.
   *
   */
  // Can control visibility with:
  /**
   * - public
   * - private
   * - protected
   */

  /**
   * Signals: A signal is a reactive primitive used for state management
   * that automatically tracks where it is used and notifies subscribers
   * when its value changes
   */


  // Accounts Property which is a signal holding an array of accounts that starts empty.
  // Private : means only this service(AuthService) can touch it.
  // accounts: is the property name
  // = : assigns the value
  // signal<Account[]>([]): creates a signal holding an array of Account, starting empty.
  // <Account[]>: an array of Account
  // ([]) : is the initial value, passed as the argument: an empty array.
  private accounts = signal<Account[]>([]);

  // ': Account' means of type account to return or return an account
  // Omit : a typescript utility type, that creates a new type by taking an existing type and removing some fields.
  // in this case the 'id' field is removed
  public register(account: Omit<Account, 'id'>): Account {
    // 1. Get current list
    const current = this.accounts();

    // 2. Figure out the nxt id
    // - if current is empty -> 1
    // - otherwise -> highest id + 1

    let nextId : number;

    // check if list is empty
    if (current.length === 0){
      nextId = 1;
    }else{
      const ids = current.map(a => a.id); // [1,2,5] -> just the ids
      nextId = Math.max(...ids) + 1;    // highest id + 1
    }

    // 3. Build the new account : the passed
    const newAccount: Account = { ...account, id: nextId}

    // 4. Add it to the signal (return a NEW array, don't push)
    this.accounts.update(accounts => [...accounts, newAccount]);

    return newAccount;

  }

  public login(){  }


}
