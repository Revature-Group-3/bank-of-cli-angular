import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { TransactionCenter } from './pages/transaction-center/transaction-center';
import { ViewTransactions } from './pages/view-transactions/view-transactions';
import { TransactionTest } from './pages/transaction-test/transaction-test';
import { TransactionForm } from './shared/components/transaction-form/transaction-form';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'register', component: Register },
  { path: 'dashboard', component: Dashboard },
  { path: 'transaction', component: TransactionCenter },
  { path: 'view-transactions', component: ViewTransactions },
  { path: 'transaction', redirectTo: 'transaction/deposit', pathMatch: 'full' },
  { path: 'transaction/:type', component: TransactionForm },

  { path: 'transaction-test', component: TransactionTest },
];
