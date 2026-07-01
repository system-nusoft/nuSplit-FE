"use client";

import React, { useState } from "react";
import { BalancesResponse, SimplifiedTransaction } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import SettleUpModal from "./SettleUpModal";

interface BalancesCardProps {
  balances: BalancesResponse;
  groupId: string;
  baseCurrency: string;
  onSettled: () => void;
}

export default function BalancesCard({ balances, groupId, baseCurrency, onSettled }: BalancesCardProps) {
  const { user } = useAuth();
  const [settleTarget, setSettleTarget] = useState<SimplifiedTransaction | null>(null);

  const { simplifiedTransactions, balances: memberBalances } = balances;

  const allSquare = simplifiedTransactions.length === 0;

  return (
    <>
      <Card padding="md">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Balances
        </h2>

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
