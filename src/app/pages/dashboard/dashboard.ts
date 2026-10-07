import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TransactionTable } from '../../shared/transaction-table/transaction-table';

// User-facing dashboard
@Component({
  imports: [MatCardModule, TransactionTable],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {}
