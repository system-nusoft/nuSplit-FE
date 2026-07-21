"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { SimplifiedTransaction } from "@/types";
import { createSettlementApi } from "@/lib/services/groups.service";

interface SettleUpModalProps {
  open: boolean;
  onClose: () => void;
  groupId: string;
  transaction: SimplifiedTransaction;
  onSettled: () => void;
}

export default function SettleUpModal({
  open,
  onClose,
  groupId,
  transaction,
  onSettled,
}: SettleUpModalProps) {
  const { t } = useTranslation();
  const [amount, setAmount] = useState(transaction.amount.toFixed(2));
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createSettlementApi(groupId, {
        toUserId: transaction.toUserId,
        amount,
        note: note.trim() || undefined,
      });
      onSettled();
    } catch {
      setError(t("settleUp.errorRecord"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={t("settleUp.title")}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-indigo-50 rounded-xl p-4 text-sm text-gray-700">
          <p>
            {t("settleUp.payingLabel")}{" "}
            <span className="font-semibold text-indigo-700">{transaction.toName}</span>
          </p>
        </div>

        <Input
          label={t("settleUp.amountLabel")}
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0.01"
          step="0.01"
          required
        />

        <Input
          label={t("settleUp.noteLabel")}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t("settleUp.notePlaceholder")}
        />

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <div className="flex gap-3 pt-1">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            {t("settleUp.cancel")}
          </Button>
          <Button type="submit" loading={loading} className="flex-1">
            {t("settleUp.recordPayment")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
