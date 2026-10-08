import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
  imports: [ReactiveFormsModule, RouterLink, MatInputModule, MatButtonModule, MatFormFieldModule, MatCardModule, MatIcon],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  private redirectLogin = inject(Router);
  private authService = inject(AuthService);

  message = signal('');

  RegisterForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required)
  });

  onSubmit() {
    if (this.RegisterForm.invalid) {
      this.RegisterForm.markAllAsTouched();
      return;
    }

    const form = this.RegisterForm.value;

    const created = this.authService.register({
      firstName: form.firstName ?? '',
      lastName: form.lastName ?? '',
      username: form.username ?? '',
      password: form.password ?? '',
      balance: 0,
    });

    if (created === null) {
      this.message.set('Username is already taken, please use another username.');
      console.log('Could not create account.');
    } else if (form.password !== form.confirmPassword) {
      this.message.set('Passwords do not match.');
    } else {
      this.message.set('Account created! Hold on while we re-direct you to the login page...');
      setTimeout(() => {
        this.redirectLogin.navigate(['/']);
      }, 2000);
    }
  }
}