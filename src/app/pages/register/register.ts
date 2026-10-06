import { Component, inject } from '@angular/core';
import { signal } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  // Call services
  private authService = inject(AuthService);
  private redirectLogin = inject(Router);   // Redirect to login page

  /**
   * We need to capture submitted data from forms.
   * We can do that through an event such as -> "click()".
   * Then we need to store or set that data somewhere.
   * We can do that by creating a new user with set fields,
   * in this case a new account with set username and password, etc..
   */

  // [value] = "firstName()",  [value] = "lastName()",etc.
  firstName = signal('');
  lastName = signal('');
  username = signal('');
  password = signal('');

  // Message output to the browser depending on case
  message = signal('');

  // Signal for login success if redirect doesn't happen
  registered = signal(false);

  // Call register functionality from AuthService
  onRegister(){
    const newAccount = {
      firstName: this.firstName(), // read a signal by calling it
      lastName: this.lastName(),
      username: this.username(),
      password: this.password(),
      balance:0,
    };

    const created = this.authService.register(newAccount);

    if(created === null){
      this.message.set('Username taken :( ... Please choose another username.');
      console.log('Username taken. Could not create account.');
    }else{
      this.message.set('Account successfully created! Wait a few seconds as we re-direct you to the log in page.');

      // Temporary log for testing purposes: Result of Register on signup.
      console.log('Account successfully created.', created);

      this.registered.set(true);
      // Lambda expression : timeout 2 sec before re-routing to log in page
      setTimeout(() => {
        this.redirectLogin.navigate(['/login']);
      }, 2000);
    }
  }
}
