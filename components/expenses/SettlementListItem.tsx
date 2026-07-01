"use client";

import { Settlement } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

interface SettlementListItemProps {
  settlement: Settlement;
}

export default function SettlementListItem({ settlement }: SettlementListItemProps) {
  const { user } = useAuth();
  const isSender = settlement.fromUserId === user?.id;
  const isReceiver = settlement.toUserId === user?.id;

  const fromName = settlement.fromName || settlement.fromUserId;
  const toName = settlement.toName || settlement.toUserId;

  return (
    <div className="flex items-start gap-4 py-4 border-b border-gray-50 last:border-0">
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">
          {isSender ? "You" : fromName}
          <span className="text-gray-400 font-normal"> paid </span>
          {isReceiver ? "you" : toName}
        </p>
        {settlement.note && (
          <p className="text-xs text-gray-400 mt-0.5">{settlement.note}</p>
        )}
        <p className="text-xs text-gray-400 mt-0.5">
          {new Date(settlement.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
          {" · "}
          <span className="text-green-600 font-medium">Settlement</span>
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="font-semibold text-green-700">
          ${parseFloat(settlement.amount).toFixed(2)}
        </p>
        <p className="text-xs text-gray-400">{settlement.currency}</p>
      </div>
    </div>
  );
}
