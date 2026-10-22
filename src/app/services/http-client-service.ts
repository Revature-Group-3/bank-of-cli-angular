import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Account } from '../models/account';
import {
  DepositRequest,
  RecentTransactionsResponse,
  StandardTransaction,
  WithdrawalRequest
} from '../models/transaction';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  // Omitted to match the backend, which only expects a token
  // account: Omit<Account, 'password'>;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ApiTransferRequest {
  recipientAccountEmail: string;
  amountInCents: number;
}

export interface ApiTransferResponse {
  id: number;
  senderAccountEmail: string;
  recipientAccountEmail: string;
  type: 'TRANSFER';
  amountInCents: number;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/auth/login`,
      request
    );
  }

  register(request: RegisterRequest): Observable<unknown> {
    return this.http.post<unknown>(
      `${this.apiUrl}/auth/register`,
      request
    );
  }

  getTransactions(): Observable<RecentTransactionsResponse> {
    return this.http.get<RecentTransactionsResponse>(
      `${this.apiUrl}/accounts/me/transactions`
    );
  }

  deposit(request: DepositRequest): Observable<StandardTransaction> {
    return this.http.post<StandardTransaction>(
      `${this.apiUrl}/accounts/me/deposits`,
      request
    );
  }

  withdraw(request: WithdrawalRequest): Observable<StandardTransaction> {
    return this.http.post<StandardTransaction>(
      `${this.apiUrl}/accounts/me/withdraw`,
      request
    );
  }

  transfer(
    request: ApiTransferRequest
  ): Observable<ApiTransferResponse> {
    return this.http.post<ApiTransferResponse>(
      `${this.apiUrl}/transfers`,
      request
    );
  }

  getMockAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>('/accounts.json');
  }
}