// the service sends back, the same as what the user sends in, as well as id, type and timestamp
export interface StandardTransaction {
  id: number;
  accountId: number;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  amount: number;
  timestamp: string;
}

export interface TransferTransaction {
  id: number;
  senderAccountId: number;
  recipientAccountId: number;
  type: 'TRANSFER';
  amount: number;
  timestamp: string;
}

export type Transaction = StandardTransaction | TransferTransaction;

// what the page sends in: the account (from the logged-in user) and the amount the user typed
export interface DepositRequest {
  accountId: number;
  amount: number;
}

export interface WithdrawalRequest {
  accountId: number;
  amount: number;
}

export interface TransferRequest {
  senderAccountId: number;
  recipientAccountId: number;
  amount: number;
}

