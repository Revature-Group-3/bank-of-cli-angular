import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  private redirectLogin = inject(Router);
  private authService = inject(AuthService);

  message = signal('');

  RegisterForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    username: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl('')
  })
  // on submit it will print out the data onto the console log
  // Stores data in JSON like structure
  onSubmit() {
    const form = this.RegisterForm.value;

    const created = this.authService.register({
      firstName: form.firstName??'',
      lastName: form.lastName??'',
      username: form.username??'',
      password: form.password??'',
      balance: 0,
    });

    if (created === null){
      this.message.set("Username is already taken :( ... Please use another username. ");
      console.log("Could not create account.");
    }else{
      this.message.set("Account created! Hold on while we re-direct you to the login page...");
      console.log(form);
      setTimeout(() => {
        this.redirectLogin.navigate(['/']);
      }, 2000);

    }

  }
}
