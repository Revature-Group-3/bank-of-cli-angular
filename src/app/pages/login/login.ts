
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

// Reuse the team's existing progress bar component.
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
    ProgressBar
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private authService = inject(AuthService);
  private router = inject(Router);

  // Displays successful or unsuccessful login messages.
  message = signal('');

  // Tracks whether the login process is running.
  isLoading = signal(false);

  // Existing login form.
  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });

  onSubmit() {

    // Prevent multiple submissions while loading.
    if (this.isLoading()) {
      return;
    }

    // Show the loading bar.
    this.isLoading.set(true);

    // Clear any previous login message.
    this.message.set('');

    // Read the username and password.
    const form = this.loginForm.value;

    // Temporary 1-second delay for the current mock-data setup.
    // When login uses a real HTTP request, loading should
    // follow the request instead of using this delay.
    setTimeout(() => {

      // Use the team's existing authentication service.
      const loggedIn = this.authService.login(
        form.username ?? '',
        form.password ?? ''
      );

      // Authentication has finished.
      this.isLoading.set(false);

      if (loggedIn === null) {

        // Login denied.
        this.message.set(
          'Invalid username or password. Please try again.'
        );

        console.log('Unable to login.');

      } else {

        // Login successful.
        this.message.set(
          'You are logged in! Redirecting to your dashboard...'
        );

        console.log('Login Successful.');

        // Preserve the team's existing redirect delay.
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1000);
      }

    }, 1000);
  }
}
