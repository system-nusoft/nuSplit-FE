import { get, post, patch, del } from "@/lib/api";
import { Expense, PaginatedResponse, SplitMethod } from "@/types";

export interface SplitParticipant {
  userId: string;
  value?: number;
}

export interface CreateExpensePayload {
  description: string;
  amount: string;
  currency?: string;
  paidById: string;
  splitMethod: SplitMethod;
  participants: SplitParticipant[];
}

export async function createExpenseApi(groupId: string, payload: CreateExpensePayload): Promise<Expense> {
  return post<Expense>(`/groups/${groupId}/expenses`, payload);
}

export async function getExpensesApi(
  groupId: string,
  page = 1,
  limit = 20
): Promise<PaginatedResponse<Expense>> {
  return get<PaginatedResponse<Expense>>(
    `/groups/${groupId}/expenses?page=${page}&limit=${limit}`
  );
}

export async function updateExpenseApi(
  groupId: string,
  expenseId: string,
  payload: Partial<CreateExpensePayload>
): Promise<Expense> {
  return patch<Expense>(`/groups/${groupId}/expenses/${expenseId}`, payload);
}

export async function deleteExpenseApi(groupId: string, expenseId: string): Promise<void> {
  return del<void>(`/groups/${groupId}/expenses/${expenseId}`);
}
