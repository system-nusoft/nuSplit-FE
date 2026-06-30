import { get, post } from "@/lib/api";
import { Group, GroupDetail } from "@/types";

export interface CreateGroupPayload {
  name: string;
  emoji?: string;
  avatarColor?: string;
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
