import { get, post, patch, del } from "@/lib/api";
import { Group, GroupDetail, BalancesResponse, Settlement } from "@/types";

export interface CreateGroupPayload {
  name: string;
  emoji?: string;
  avatarColor?: string;
  baseCurrency?: string;
}

export interface UpdateGroupPayload {
  name?: string;
  emoji?: string;
  avatarColor?: string;
  baseCurrency?: string;
}

export interface InviteResponse {
  token: string;
  expiresAt: string;
}

export interface InvitePreview {
  groupId: string;
  groupName: string;
  emoji?: string;
  avatarColor: string;
  expiresAt?: string;
}

export async function createGroupApi(payload: CreateGroupPayload): Promise<Group> {
  return post<Group>("/groups", payload);
}

export async function updateGroupApi(id: string, payload: UpdateGroupPayload): Promise<Group> {
  return patch<Group>(`/groups/${id}`, payload);
}

export async function getGroupsApi(): Promise<Group[]> {
  return get<Group[]>("/groups");
}

export async function getGroupApi(id: string): Promise<GroupDetail> {
  return get<GroupDetail>(`/groups/${id}`);
}

export async function createInviteApi(groupId: string): Promise<InviteResponse> {
  return post<InviteResponse>(`/groups/${groupId}/invite`);
}

export async function getInvitePreviewApi(token: string): Promise<InvitePreview> {
  return get<InvitePreview>(`/groups/invite/${token}/preview`);
}

export async function acceptInviteApi(token: string): Promise<GroupDetail> {
  return post<GroupDetail>(`/groups/invite/${token}/accept`);
}

export async function getBalancesApi(groupId: string): Promise<BalancesResponse> {
  return get<BalancesResponse>(`/groups/${groupId}/balances`);
}

export interface CreateSettlementPayload {
  toUserId: string;
  amount: string;
  currency?: string;
  note?: string;
}

export async function createSettlementApi(groupId: string, payload: CreateSettlementPayload): Promise<Settlement> {
  return post<Settlement>(`/groups/${groupId}/settlements`, payload);
}

export async function confirmSettlementApi(groupId: string, settlementId: string): Promise<Settlement> {
  return patch<Settlement>(`/groups/${groupId}/settlements/${settlementId}/confirm`, {});
}

export async function deleteSettlementApi(groupId: string, settlementId: string): Promise<void> {
  return del(`/groups/${groupId}/settlements/${settlementId}`);
}

export async function sendRemindersApi(groupId: string): Promise<{ sent: number }> {
  return post<{ sent: number }>(`/groups/${groupId}/remind`, {});
}

export async function removeMemberApi(groupId: string, userId: string): Promise<void> {
  return del(`/groups/${groupId}/members/${userId}`);
}
