import { Component, signal, inject, computed } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators'; 
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth-service';
import { Navbar } from './shared/navbar/navbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MobileNavbar } from './shared/mobile-navbar/mobile-navbar';

@Component({
  imports: [RouterOutlet, Navbar, MatSidenavModule, MobileNavbar],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('bank-of-cli-angular');
  sidebarOpen = signal(false);

  // Detects whether user is logged in or not
  private authService = inject(AuthService);
  loggedIn = computed(() => this.authService.currentUser());

  // Detect screen size
  private breakpointObserver = inject(BreakpointObserver);
  isMobile = toSignal(
    this.breakpointObserver.observe([Breakpoints.Handset]).pipe(
      map(result => result.matches)
    ),
    { initialValue: false }
  );

  constructor(){
    setTimeout(() => this.sidebarOpen.set(true));
  }
}
