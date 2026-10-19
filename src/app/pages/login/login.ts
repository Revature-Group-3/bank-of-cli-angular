import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { finalize } from 'rxjs';

import { AuthService } from '../../services/auth-service';
import { ProgressBar } from '../../progress-bar/progress-bar';

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

  onSubmit(): void {

    // Prevent duplicate submissions.
    if (this.isLoading() || this.loginSucceeded()) {
      return;
    }

    // Preserve the team's required-field validation.
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.message.set('Please fill in the fields.');
      return;
    }

    const form = this.loginForm.getRawValue();

    // Preserve the team's blank username validation.
    if (!form.username?.trim()) {
      this.message.set('Email cannot be blank.');
      return;
    }

    // Preserve the team's blank password validation.
    if (!form.password?.trim()) {
      this.message.set('Password cannot be blank.');
      return;
    }

    const email = form.username.trim();
    const password = form.password;

    // Start loading after the inputs pass validation.
    this.isLoading.set(true);
    this.message.set('');

    // Temporary delay because authentication uses mock data.
    // Replace with the HTTP request's loading state later.
    // The temporary delay has now been replaced by the HTTP request.

    // Use the team's existing authentication service.
    this.authService.login(email, password)
      .pipe(
        finalize(() => {
          // Authentication is finished.
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: () => {
          // Show the success message before redirecting.
          this.loginSucceeded.set(true);

          this.message.set(
            'You are logged in! Redirecting to your dashboard...'
          );

          // Give the user time to see the confirmation.
          setTimeout(() => {
            void this.router.navigate(['/dashboard']);
          }, 1000);
        },

        error: (error: HttpErrorResponse) => {
          // Show the existing login error.
          if (error.status === 401) {
            this.message.set(
              'Invalid email or password. Please try again.'
            );
          } else if (error.status === 0) {
            this.message.set(
              'Unable to reach the server. Please try again.'
            );
          } else {
            this.message.set(
              'Login failed. Please try again later.'
            );
          }
        }
      });
  }
}