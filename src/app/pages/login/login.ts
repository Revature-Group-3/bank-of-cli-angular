import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
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
    const loggedIn = this.authService.login(form.username?? '', form.password ?? '');
    //console.log(this.loginForm.value);
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
