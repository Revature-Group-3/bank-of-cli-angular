import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { Dashboard } from './dashboard/dashboard';
import { Transaction } from './transaction/transaction';

export const routes: Routes = [
  {
    path: '',
    redirectTo:'login',
    pathMatch: 'full'
  },
  {
    path: 'register',
    component: Register
  },
  {
    path: 'dashboard',
    component: Dashboard
  },
  {
    path: 'transaction',
    component: Transaction
  },
  {
    path: "view-transactions",
    component: ViewTransition
  }
];
