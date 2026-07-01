export interface User {
  id: string;
  email: string;
  name?: string;
  phoneNumber?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface GroupMember {
  id: string;
  name?: string;
  email: string;
  joinedAt: string;
}

export interface Group {
  id: string;
  name: string;
  emoji?: string;
  avatarColor: string;
  baseCurrency: string;
  createdById: string;
  createdAt: string;
  memberCount: number;
}

export interface GroupDetail {
  id: string;
  name: string;
  emoji?: string;
  avatarColor: string;
  baseCurrency: string;
  createdById: string;
  createdAt: string;
  members: GroupMember[];
}

export type SplitMethod = "EQUAL" | "SHARES" | "PERCENTAGE" | "CUSTOM";

export interface ExpenseSplitEntry {
  id: string;
  userId: string;
  user: { id: string; name?: string; email: string };
  amountOwed: string;
  shareValue?: string;
}

export interface Expense {
  id: string;
  groupId: string;
  paidById: string;
  paidBy: { id: string; name?: string; email: string };
  description: string;
  amount: string;
  currency: string;
  exchangeRate?: string;
  amountInBase?: string;
  splitMethod: SplitMethod;
  createdAt: string;
  splits: ExpenseSplitEntry[];
}

export interface LineItem {
  name: string;
  amount: number;
}

export interface ScanReceiptResult {
  description: string;
  amount: number;
  currency: string;
  lineItems: LineItem[];
  confidence: number;
  rawText: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface MemberBalance {
  userId: string;
  name?: string;
  email: string;
  amount: number;
}

export interface SimplifiedTransaction {
  fromUserId: string;
  fromName: string;
  toUserId: string;
  toName: string;
  amount: number;
}

export interface Settlement {
  id: string;
  fromUserId: string;
  fromName: string;
  toUserId: string;
  toName: string;
  amount: string;
  currency: string;
  note?: string;
  createdAt: string;
}

export interface BalancesResponse {
  balances: MemberBalance[];
  simplifiedTransactions: SimplifiedTransaction[];
  settlements: Settlement[];
}

export interface Comment {
  id: string;
  expenseId: string;
  userId: string;
  user: { id: string; name?: string; email: string };
  body: string;
  createdAt: string;
}
