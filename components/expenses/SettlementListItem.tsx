"use client";

import { useState } from "react";
import { Settlement } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/Button";
import { confirmSettlementApi, deleteSettlementApi } from "@/lib/services/groups.service";

interface SettlementListItemProps {
  settlement: Settlement;
  groupId: string;
  onUpdated: () => void;
}

export default function SettlementListItem({ settlement, groupId, onUpdated }: SettlementListItemProps) {
  const { user } = useAuth();
  const isSender = settlement.fromUserId === user?.id;
  const isReceiver = settlement.toUserId === user?.id;
  const isPending = settlement.status === "PENDING";

  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fromName = settlement.fromName || settlement.fromUserId;
  const toName = settlement.toName || settlement.toUserId;

  async function handleConfirm() {
    setConfirming(true);
    try {
      await confirmSettlementApi(groupId, settlement.id);
      onUpdated();
    } finally {
      setConfirming(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteSettlementApi(groupId, settlement.id);
      onUpdated();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex items-start gap-4 py-4 border-b border-gray-50 last:border-0">
      <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${isPending ? "bg-amber-100" : "bg-green-100"}`}>
        {isPending ? (
          <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
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
          {isPending ? (
            <span className="text-amber-500 font-medium">Pending confirmation</span>
          ) : (
            <span className="text-green-600 font-medium">Confirmed</span>
          )}
        </p>

        {isPending && (
          <div className="flex gap-2 mt-2">
            {isReceiver && (
              <Button size="sm" onClick={handleConfirm} loading={confirming}>
                Confirm payment
              </Button>
            )}
            {isSender && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-xs text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="text-right flex-shrink-0">
        <p className={`font-semibold ${isPending ? "text-amber-600" : "text-green-700"}`}>
          {parseFloat(settlement.amount).toFixed(2)}
        </p>
        <p className="text-xs text-gray-400">{settlement.currency}</p>
      </div>
    </div>
  );
}
