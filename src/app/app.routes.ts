import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { TransactionCenter } from './pages/transaction-center/transaction-center';
import { ViewTransactions } from './pages/view-transactions/view-transactions';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'register', component: Register },
  { path: 'dashboard', component: Dashboard },
  { path: 'transaction', component: TransactionCenter },
  { path: 'view-transactions', component: ViewTransactions },
];
