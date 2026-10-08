import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { ViewTransactions } from './pages/view-transactions/view-transactions';
import { TransactionTest } from './pages/transaction-test/transaction-test';
import { Test } from './pages/test/test';
import { loggedInGuard } from './shared/guards/logged-in-guard';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'register', component: Register },
  { path: 'dashboard', component: Dashboard, canActivate: [loggedInGuard] },
  { path: 'view-transactions', component: ViewTransactions, canActivate: [loggedInGuard] },
  { path: 'transaction-test', component: TransactionTest, canActivate: [loggedInGuard] },
  { path: 'test', component: Test },

  { path: '**', redirectTo: '', pathMatch: 'full' }
];
