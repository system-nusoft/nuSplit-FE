import axiosInstance, { get, post, patch, del } from "@/lib/api";
import { Comment, Expense, PaginatedResponse, ScanReceiptResult, SplitMethod } from "@/types";

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
  exchangeRate?: number;
  amountInBase?: string;
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

export async function scanReceiptApi(groupId: string, file: File): Promise<ScanReceiptResult> {
  const form = new FormData();
  form.append("receipt", file);
  const { data } = await axiosInstance.post<ScanReceiptResult>(
    `/groups/${groupId}/expenses/scan`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
}

export async function getCommentsApi(groupId: string, expenseId: string): Promise<Comment[]> {
  return get<Comment[]>(`/groups/${groupId}/expenses/${expenseId}/comments`);
}

export async function createCommentApi(groupId: string, expenseId: string, body: string): Promise<Comment> {
  return post<Comment>(`/groups/${groupId}/expenses/${expenseId}/comments`, { body });
}

export async function deleteCommentApi(groupId: string, expenseId: string, commentId: string): Promise<void> {
  return del<void>(`/groups/${groupId}/expenses/${expenseId}/comments/${commentId}`);
}
