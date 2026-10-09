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

  message = signal('');

  isLoading = signal(false);

  loginSucceeded = signal(false);

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  onSubmit() {

    // Prevent duplicate submissions.
    if (this.isLoading() || this.loginSucceeded()) {
      return;
    }

    // Preserve the team's required-field validation.
    if (this.loginForm.invalid) {
      this.message.set('Please fill in the fields.');
      return;
    }

    const form = this.loginForm.value;

    // Preserve the team's blank username validation.
    if (!form.username?.trim()) {
      this.message.set('Username cannot be blank.');
      return;
    }

    // Preserve the team's blank password validation.
    if (!form.password?.trim()) {
      this.message.set('Password cannot be blank.');
      return;
    }

    // Start loading after the inputs pass validation.
    this.isLoading.set(true);
    this.message.set('');

    // Temporary delay because authentication uses mock data.
    // Replace with the HTTP request's loading state later.
    setTimeout(() => {

      // Use the team's existing authentication service.
      const loggedIn = this.authService.login(
        form.username ?? '',
        form.password ?? ''
      );

      // Authentication is finished.
      this.isLoading.set(false);

      if (loggedIn === null) {

        // Show the existing login error.
        this.message.set(
          'Invalid username or password. Please try again.'
        );

      } else {

        // Show the success message before redirecting.
        this.loginSucceeded.set(true);

        this.message.set(
          'You are logged in! Redirecting to your dashboard...'
        );

        // Give the user time to see the confirmation.
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1000);
      }

    }, 1000);
  }
}
