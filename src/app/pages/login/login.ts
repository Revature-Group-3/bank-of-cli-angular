import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

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
    username: new FormControl(''),
    password: new FormControl('')
  });

  onSubmit() {
    const form = this.loginForm.value;
    const loggedIn = this.authService.login(form.username ?? '', form.password ?? '');

    if (loggedIn === null) {
      this.message.set('Invalid username or password. Please try again.');
      console.log('Unable to login.');
    } else {
      this.message.set('You are logged in! Redirecting to your dashboard...');
      console.log('Login Successful.');
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 2000);
    }
  }
}