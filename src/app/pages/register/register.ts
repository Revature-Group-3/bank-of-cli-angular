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

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatIcon
  ],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  private redirectLogin = inject(Router);
  private authService = inject(AuthService);

  message = signal('');
  isLoading = signal(false);
  registrationSucceeded = signal(false);

  RegisterForm = new FormGroup({
    firstName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    lastName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  onSubmit(): void {
    if (this.isLoading() || this.registrationSucceeded()) {
      return;
    }

    // Check if form is not filled, return.
    if (this.RegisterForm.invalid) {
      this.RegisterForm.markAllAsTouched();
      this.message.set('Please fill in all fields.');
      console.log('Form not filled.');
      return;
    }

    const form = this.RegisterForm.getRawValue();

    // Make sure white space is not accepted
    if (!form.firstName.trim()) {
      this.message.set('First name cannot be blank.');
      return;
    }

    if (!form.lastName.trim()) {
      this.message.set('Last name cannot be blank.');
      return;
    }

    if (!form.username.trim()) {
      this.message.set('Email cannot be blank.');
      return;
    }

    const email = form.username.trim();

    if (Validators.email(new FormControl(email)) !== null) {
      this.message.set('Please enter a valid email address.');
      return;
    }

    if (!form.password.trim()) {
      this.message.set('Password cannot be blank.');
      return;
    }

    // Confirm Password with confirm password
    if (form.password !== form.confirmPassword) {
      this.message.set('Passwords do not match.');
      return;
    }

    this.isLoading.set(true);
    this.message.set('');

    this.authService.register({
      // the ?? is just if the firstName is null or defined it gets assigned ''
      firstName: (form.firstName ?? '').trim(),
      lastName: form.lastName.trim(),
      email,
      password: form.password
    })
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: () => {
          this.registrationSucceeded.set(true);

          this.message.set(
            'Account created! Hold on while we re-direct you to the login page...'
          );

          setTimeout(() => {
            void this.redirectLogin.navigate(['/']);
          }, 500);
        },

        error: (error: HttpErrorResponse) => {
          if (error.status === 409) {
            this.message.set(
              'An account with this email already exists.'
            );
          } else if (error.status === 400) {
            this.message.set(
              'Registration details were rejected. Please check your information.'
            );
          } else if (error.status === 0) {
            this.message.set(
              'Unable to reach the server. Please try again.'
            );
          } else {
            this.message.set(
              'Could not create your account. Please try again later.'
            );
          }

          console.log('Could not create account.');
        }
      });
  }
}