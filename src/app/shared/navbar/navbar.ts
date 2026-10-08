import { Component, inject, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.html',
  styleUrl: 'navbar.css',
  imports: [MatListModule],
})
export class Navbar {

  private authService = inject(AuthService);
  private router = inject(Router);
  message = signal('');

  onSignOut(){

    // 1. log the user out through the service
    this.authService.logout();
    this.message.set('Account user signing out...');
    console.log('Signing out...');
    // 2. navigate to the login page('/')
    setTimeout(() => {
        this.router.navigate(['/']);
      }, 1000);
  }
}
