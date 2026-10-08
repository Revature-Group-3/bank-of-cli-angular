import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../services/auth-service';

// RouterLink is for any links that might need to be added to the dashboard
import { RouterLink } from '@angular/router';

// For money
import { CentsIntegerToDollarStringPipe } from '../../shared/pipes/cents-integer-to-dollar-string-pipe';

// Dashboard components
import { MatCardModule } from '@angular/material/card';
import { TransactionTable } from '../../shared/transaction-table/transaction-table';

// User-facing dashboard
@Component({
  imports: [CentsIntegerToDollarStringPipe, MatCardModule, TransactionTable],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {

  /**
   * The logged-in account is stored in AuthService.currentUser when login
   * succeeds. AuthService is a shared singleton, so that state survives the
   * page change from login to dashboard. The dashboard reads currentUser()
   * to get the name and balance; it's null if nobody is logged in.
   */

  // inject service class
  private authService = inject(AuthService);

  /**
   * The ?. is optional chaining. currentUser() returns Account | null,
   * so TypeScript won't let you write .firstName directly, because if
   * nobody is logged in that's null.
   *
   * Theres another catch - It only runs once, when the component is created.
   * firstName becomes a plain string at that moment and never updates.
   * If the balance or user changes later (after a deposit, say), the
   * dashboard wouldn't notice. That's what computed() fixes: it re-runs
   * whenever the signals it reads change.
   */
  //firstName = this.authService.currentUser()?.firstName;

  // re-runs whenever the signals it reads change.
  firstName = computed(() => this.authService.currentUser()?.firstName);
  balance = computed(() => this.authService.currentUser()?.balance);
}
