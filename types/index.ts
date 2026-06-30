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
  createdById: string;
  createdAt: string;
  memberCount: number;
}

export interface GroupDetail {
  id: string;
  name: string;
  emoji?: string;
  avatarColor: string;
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
  splitMethod: SplitMethod;
  createdAt: string;
  splits: ExpenseSplitEntry[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
