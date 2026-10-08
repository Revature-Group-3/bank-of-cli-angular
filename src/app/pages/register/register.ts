import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

import { Validators } from '@angular/forms';

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
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  onSubmit() {

    // Check if form is not filled, return.
    if (this.RegisterForm.invalid){
      this.message.set('Please fill in all fields.');
      console.log('Form not filled.');
      return;
    }
    const form = this.RegisterForm.value;

    // Make sure white space is not accepted
    if ( !form.firstName?.trim() ){
      this.message.set('First name cannot be blank.');
      return;
    }

    if (!form.lastName?.trim()){
      this.message.set('Last name cannot be blank.');
      return;
    }

    if (!form.username?.trim()){
      this.message.set('Username cannot be blank.');
      return;
    }

    // Confirm Password with confirm password
    if (form.password?.trim() !== form.confirmPassword){
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
      this.message.set('Username is already taken :( ... Please use another username.');
      console.log('Could not create account.');
    } else {
      this.message.set('Account created! Hold on while we re-direct you to the login page...');
      setTimeout(() => {
        this.redirectLogin.navigate(['/']);
      }, 500);
    }
  }
}
