import { Component, inject, computed } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.html',
  styleUrl: 'navbar.css',
  imports: [MatListModule],
})
export class Navbar {
  private authService = inject(AuthService);

  // Computed for current user to logout
  loggedIn = computed( () => this.authService.currentUser());
}
