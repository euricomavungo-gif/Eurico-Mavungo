
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export enum SubscriptionStatus {
  TRIAL = 'TRIAL',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: number;
  subscriptionStatus: SubscriptionStatus;
  categories?: {
    income: string[];
    expense: string[];
    shopping: string[];
  };
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string;
  note?: string;
}

export interface ShoppingItem {
  id: string;
  userId: string;
  name: string;
  price: number;
  category: string;
  isPriority: boolean;
  isFuture: boolean;
  date: string;
  checked?: boolean;
}

export type ViewType = 'dashboard' | 'transactions' | 'shopping' | 'future' | 'analytics' | 'reports';
