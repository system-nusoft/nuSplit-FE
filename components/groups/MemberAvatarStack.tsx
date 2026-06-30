"use client";

import { GroupMember } from "@/types";
import Avatar from "@/components/Avatar";

interface MemberAvatarStackProps {
  members: GroupMember[];
  max?: number;
}

const COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f97316",
  "#10b981", "#06b6d4", "#f59e0b", "#ef4444",
];

export default function MemberAvatarStack({ members, max = 5 }: MemberAvatarStackProps) {
  const visible = members.slice(0, max);
  const overflow = members.length - max;

  return (
    <div className="flex -space-x-2">
      {visible.map((m, i) => (
        <div key={m.id} className="ring-2 ring-white rounded-full" title={m.name || m.email}>
          <Avatar name={m.name || m.email} color={COLORS[i % COLORS.length]} size="sm" />
        </div>
      ))}
      {overflow > 0 && (
        <div className="w-7 h-7 rounded-full bg-gray-200 ring-2 ring-white flex items-center justify-center text-xs font-medium text-gray-600">
          +{overflow}
        </div>
      )}
    </div>
  );
}
