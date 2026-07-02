"use client";

import React, { useState } from "react";
import { BalancesResponse, SimplifiedTransaction } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import SettleUpModal from "./SettleUpModal";
import { sendRemindersApi } from "@/lib/services/groups.service";

interface BalancesCardProps {
  balances: BalancesResponse;
  groupId: string;
  groupName: string;
  baseCurrency: string;
  onSettled: () => void;
}

export default function BalancesCard({ balances, groupId, groupName, baseCurrency, onSettled }: BalancesCardProps) {
  const { user } = useAuth();
  const [settleTarget, setSettleTarget] = useState<SimplifiedTransaction | null>(null);
  const [reminding, setReminding] = useState(false);
  const [reminderSent, setReminderSent] = useState(false);

  async function handleSendReminders() {
    setReminding(true);
    try {
      const { sent } = await sendRemindersApi(groupId);
      setReminderSent(true);
      setTimeout(() => setReminderSent(false), 3000);
      if (sent === 0) alert("No outstanding debtors to remind.");
    } finally {
      setReminding(false);
    }
  }

  function whatsappNudge(tx: SimplifiedTransaction) {
    const text = `Hi ${tx.fromName}, just a reminder that you owe me ${baseCurrency} ${tx.amount.toFixed(2)} in "${groupName}" on nuSplit.`;
    const phone = tx.fromPhone?.replace(/\D/g, "");
    const url = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  }

  const { simplifiedTransactions, balances: memberBalances } = balances;

  const allSquare = simplifiedTransactions.length === 0;

  return (
    <>
      <Card padding="md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Balances
          </h2>
          {!allSquare && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSendReminders}
              loading={reminding}
            >
              {reminderSent ? "Reminders sent!" : "Send reminders"}
            </Button>
          )}
        </div>

        {/* Per-member net balances */}
        <div className="space-y-2 mb-5">
          {memberBalances.map((b) => {
            const isMe = b.userId === user?.id;
            const name = b.name || b.email.split("@")[0];
            const abs = Math.abs(b.amount);
            const isOwed = b.amount > 0.005;

            return (
              <div key={b.userId} className="flex items-center justify-between gap-2">
                <span className="text-sm text-gray-700">
                  {isMe ? "You" : name}
                </span>
                {Math.abs(b.amount) < 0.005 ? (
                  <Badge color="green">Settled up</Badge>
                ) : (
                  <span
                    className={`text-sm font-semibold ${isOwed ? "text-green-600" : "text-red-600"}`}
                  >
                    {isOwed ? `+${baseCurrency} ${abs.toFixed(2)}` : `-${baseCurrency} ${abs.toFixed(2)}`}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Simplified transactions */}
        {allSquare ? (
          <div className="text-center py-3 bg-green-50 rounded-xl">
            <p className="text-sm font-medium text-green-700">Everyone is settled up!</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Suggested payments
            </p>
            {simplifiedTransactions.map((tx, i) => {
              const isMyDebt = tx.fromUserId === user?.id;
              return (
                <div
                  key={i}
                  className="flex items-center justify-between gap-2 bg-gray-50 rounded-xl px-3 py-2.5"
                >
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">
                      {isMyDebt ? "You" : tx.fromName}
                    </span>
                    {" → "}
                    <span className="font-medium">
                      {tx.toUserId === user?.id ? "you" : tx.toName}
                    </span>
                  </p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-sm font-semibold text-gray-900">
                      {baseCurrency} {tx.amount.toFixed(2)}
                    </span>
                    {isMyDebt && (
                      <Button size="sm" onClick={() => setSettleTarget(tx)}>
                        Pay
                      </Button>
                    )}
                    {tx.toUserId === user?.id && (
                      <button
                        onClick={() => whatsappNudge(tx)}
                        title="Remind via WhatsApp"
                        className="p-1.5 rounded-lg text-green-500 hover:bg-green-50 transition-colors"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {settleTarget && (
        <SettleUpModal
          open={!!settleTarget}
          onClose={() => setSettleTarget(null)}
          groupId={groupId}
          transaction={settleTarget}
          onSettled={() => {
            setSettleTarget(null);
            onSettled();
          }}
        />
      )}
    </>
  );
}
