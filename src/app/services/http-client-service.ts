import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DepositRequest, 
        RecentTransactionsResponse, 
        StandardTransaction, 
        TransferRequest, 
        TransferTransaction, 
        WithdrawalRequest } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

    apiUrl = 'http://localhost:8080/api';

    constructor(private http: HttpClient) { }

    getTransactions(): Observable<RecentTransactionsResponse> {
        return this.http.get<RecentTransactionsResponse>(`${this.apiUrl}/accounts/me/transactions`);
    }

    deposit(request: DepositRequest): Observable<StandardTransaction> {
        return this.http.post<StandardTransaction>(`${this.apiUrl}/accounts/me/deposits`, request
        );
    }

    withdraw(request: WithdrawalRequest): Observable<StandardTransaction> {
        return this.http.post<StandardTransaction>(`${this.apiUrl}/accounts/me/withdraw`, request
        );
    }

    transfer(request: TransferRequest): Observable<TransferTransaction> {
        return this.http.post<TransferTransaction>(`${this.apiUrl}/transfers`, request);
    }
}