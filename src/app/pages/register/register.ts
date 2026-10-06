// need to add inject function in order to inject Authservice class
import { Component, inject } from '@angular/core';

// Also need to import signal from @anglar/core package
import { signal } from '@angular/core';
/**
 * 1. The import path must point to the file name(auth-service),
 * not the class name(Authservice), and the file lives two folders
 * up from pages/register/:
 */
import { AuthService } from '../../services/auth-service';

// Also need to import account
import { Account } from '../../models/account';
import { Router } from '@angular/router';

// imports, injections, classes is more logic heavy. Basically logic and functionality
// vs.
// Metadata(@Component) -> which is ui, components, visual , elements heavy. Basically visuals
@Component({
  imports: [],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  // Should call service
  private authService = inject(AuthService);

  // Redirect to login page
  // 1. Inject router in component
  private redirectLogin = inject(Router);

  // Need to get submitted data from forms via the submit button.
  // Which means that an event must take place -> "click()"
  // Also we need to store that data somewhere. since it is the user's
  // new username and password, we ned to set the user's fields to the
  // submitted data. We can do that by creating a new user , in this case
  // an account and set the username and password, etc..

  // [value] = "firstName()"
  firstName = signal('');
  // [value] = "lastName()"
  lastName = signal('');
  // [value] = "username()"
  username = signal('');
  // [value] = "password()"
  password = signal('');

  // Message to output to the browser
  message = signal('');

  // Signal for login success if redirect doesnt happen
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
      // Temporary log for testing purposes: Result of Register on signup.
      this.message.set('Account successfully created! Wait a few seconds as we re-direct you to the log in page.');
      console.log('Account successfully created.', created);

      this.registered.set(true);
      // Lambda expression : timeout 2 sec before re-routing to log in page
      setTimeout(() => {
        this.redirectLogin.navigate(['/login']);
      }, 2000);
    }
  }
}
