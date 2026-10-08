import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  message = signal('');

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  onSubmit() {

    if (this.loginForm.invalid){
      this.message.set("Please fill in the fields.");
      console.log("No fields filled. Could not log user in.")
      return;
    }

    const form = this.loginForm.value;

    // Check username and password not be blank
    // ? in form.username?.trim() just means
    // that If the username is missing, or turns
    // empty once you strip the spaces, show the message and stop."
    if (!form.username?.trim()){
      this.message.set('Username cannot be blank.')
      console.log('Username is blank.');
    }

    if (!form.password?.trim()){
      this.message.set('Password cannot be blank');
      console.log('Password is blank');

    }
    const loggedIn = this.authService.login(form.username ?? '', form.password ?? '');

    if (loggedIn === null) {
      this.message.set('Invalid username or password. Please try again.');
      console.log('Unable to login.');
    } else {
      this.message.set('You are logged in! Redirecting to your dashboard...');
      console.log('Login Successful.');
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 100);
    }
  }
}
