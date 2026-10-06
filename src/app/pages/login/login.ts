import { Component, inject } from '@angular/core';
import { signal } from '@angular/core';
import { AuthService } from '../../services/auth-service';

@Component({
  imports: [],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private authService = inject(AuthService);

  username = signal('');
  password = signal('');
  message = signal('');
  subMessage = signal('');


  onLogin(){
    const username = this.username();
    const password = this.password();

    const loggedIn = this.authService.login(username, password);

    if(loggedIn === null){
      this.message.set("User does not exist :( ... Create an account with use by registering!");
      console.log('User could not be logged in.');
    }else{
      this.message.set("You are logged in! ^0^");
      this.subMessage.set("Redirecting you to your personalized home page.");
      console.log('User logged in.', loggedIn);
    }

  }

  onLogout(){
    this.authService.logout();

    this.message.set("You logged out successfully.");
    console.log("User Logged out successfully.");

  }
}
