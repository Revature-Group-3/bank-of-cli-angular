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
    firstName: new FormControl('', [Validators.required, Validators.minLength(1)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(1)]),
    username: new FormControl('', [Validators.required, Validators.minLength(1)]),
    password: new FormControl('', [Validators.required, Validators.minLength(1)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(1)])
  });

  onSubmit() {

    // Check if form is not filled, return.
    if (this.RegisterForm.invalid) {
      this.message.set('Please fill in all fields.');
      console.log('Form not filled.');
      return;
    }

    // Confirm Password with confirm password
    const form = this.RegisterForm.value;
    if (form.password !== form.confirmPassword) {
      this.message.set('Password do not match.');
      return;
    }

    const created = this.authService.register({

      // the ?? is just if the firstName is null or defined it gets assigned ''
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
