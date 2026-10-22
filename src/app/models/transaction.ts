// the service sends back, the same as what the user sends in, as well as id, type and timestamp
export interface StandardTransaction {
  id: number;
  accountId: number;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  amountInCents: number;
  timestamp: string;
}

export interface TransferTransaction {
  id: number;
  senderAccountId: number;
  recipientAccountId: number;
  type: 'TRANSFER';
  amountInCents: number;
  timestamp: string;
}

export type Transaction = StandardTransaction | TransferTransaction;

// what the page sends in: the account (from the logged-in user) and the amount the user typed
export interface DepositRequest {
  amountInCents: number;
}

export interface WithdrawalRequest {
  amountInCents: number;
}

export interface TransferRequest {
  recipientAccountEmail: string;
  amountInCents: number;
}

// what the service sends back when asked for an account's recent transactions
export interface RecentTransactionsResponse {
  transactions: Transaction[];
}
