import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth-service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { ProgressBar } from '../../progress-bar/progress-bar';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    MatCardModule,
    ProgressBar,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  message = signal('');
  isLoading = signal(false);

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(1)]),
    password: new FormControl('', [Validators.required, Validators.minLength(1)]),
  });

  onSubmit(): void {
    if (this.isLoading()) {
      return;
    }

    if (this.loginForm.invalid) {
      this.message.set('Please fill in the fields.');
      return;
    }

    const { username, password } = this.loginForm.getRawValue();
    if (!username?.trim() || !password?.trim()) {
      this.message.set('Please fill in the fields.');
      return;
    }

    this.isLoading.set(true);
    this.message.set('');

    // Allow the account list to load before checking the mock credentials.
    setTimeout(() => {
      const loggedIn = this.authService.login(username.trim(), password);
      this.isLoading.set(false);

      if (loggedIn === null) {
        this.message.set('Invalid username or password. Please try again.');
        return;
      }

      this.message.set('You are logged in! Redirecting to your dashboard...');
      setTimeout(() => {
        void this.router.navigate(['/dashboard']);
      }, 1000);
    }, 1000);
  }
}
