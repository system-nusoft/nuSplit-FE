"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { GroupDetail, SplitMethod } from "@/types";
import { getGroupApi } from "@/lib/services/groups.service";
import { createExpenseApi, SplitParticipant } from "@/lib/services/expenses.service";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Select from "@/components/Select";
import SplitMethodSelector from "@/components/expenses/SplitMethodSelector";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/contexts/AuthContext";

interface ParticipantRow {
  userId: string;
  name: string;
  email: string;
  selected: boolean;
  value: string;
}

export default function AddExpensePage() {
  const { id: groupId } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [loadingGroup, setLoadingGroup] = useState(true);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [currency] = useState("USD");
  const [paidById, setPaidById] = useState("");
  const [splitMethod, setSplitMethod] = useState<SplitMethod>("EQUAL");
  const [rows, setRows] = useState<ParticipantRow[]>([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getGroupApi(groupId)
      .then((g) => {
        setGroup(g);
        setPaidById(user?.id ?? g.members[0]?.id ?? "");
        setRows(
          g.members.map((m) => ({
            userId: m.id,
            name: m.name ?? "",
            email: m.email,
            selected: true,
            value: "",
          }))
        );
      })
      .finally(() => setLoadingGroup(false));
  }, [groupId, user?.id]);

  const selectedRows = rows.filter((r) => r.selected);
  const totalAmount = parseFloat(amount) || 0;

  const autoValues = useMemo(() => {
    const n = selectedRows.length;
    if (n === 0 || totalAmount <= 0) return {};
    if (splitMethod === "EQUAL") {
      const share = (totalAmount / n).toFixed(2);
      return Object.fromEntries(selectedRows.map((r) => [r.userId, share]));
    }
    return {};
  }, [splitMethod, selectedRows, totalAmount]);

  const runningTotal = useMemo(() => {
    if (splitMethod === "EQUAL") return totalAmount;
    return selectedRows.reduce((sum, r) => {
      const v = parseFloat(r.value) || 0;
      return sum + v;
    }, 0);
  }, [splitMethod, selectedRows, totalAmount]);

  const remaining = totalAmount - runningTotal;

  const validationError = useMemo(() => {
    if (selectedRows.length === 0) return "Select at least one participant.";
    if (splitMethod === "PERCENTAGE") {
      const sum = selectedRows.reduce((s, r) => s + (parseFloat(r.value) || 0), 0);
      if (Math.abs(sum - 100) > 0.01) return `Percentages must sum to 100 (currently ${sum.toFixed(1)}%).`;
    }
    if (splitMethod === "CUSTOM") {
      const sum = selectedRows.reduce((s, r) => s + (parseFloat(r.value) || 0), 0);
      if (Math.abs(sum - totalAmount) > 0.005)
        return `Custom amounts must sum to $${totalAmount.toFixed(2)} (currently $${sum.toFixed(2)}).`;
    }
    if (splitMethod === "SHARES") {
      if (selectedRows.some((r) => !r.value || parseFloat(r.value) <= 0))
        return "All share values must be greater than 0.";
    }
    return null;
  }, [splitMethod, selectedRows, totalAmount]);

  function updateRow(userId: string, field: keyof ParticipantRow, value: string | boolean) {
    setRows((prev) =>
      prev.map((r) => (r.userId === userId ? { ...r, [field]: value } : r))
    );
  }

  function toggleAll(checked: boolean) {
    setRows((prev) => prev.map((r) => ({ ...r, selected: checked })));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validationError) {
      setError(validationError);
      return;
    }
    setSaving(true);
    setError("");

    const participants: SplitParticipant[] = selectedRows.map((r) => {
      if (splitMethod === "EQUAL") return { userId: r.userId };
      return { userId: r.userId, value: parseFloat(r.value) };
    });

    try {
      await createExpenseApi(groupId, {
        description: description.trim(),
        amount: parseFloat(amount).toFixed(2),
        currency,
        paidById,
        splitMethod,
        participants,
      });
      router.push(`/groups/${groupId}`);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to add expense.";
      setError(typeof msg === "string" ? msg : "Failed to add expense.");
    } finally {
      setSaving(false);
    }
  }

  if (loadingGroup) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" className="text-indigo-600" />
      </div>
    );
  }

  if (!group) return null;

  const memberOptions = group.members.map((m) => ({
    value: m.id,
    label: m.name ? `${m.name} (${m.email})` : m.email,
  }));

  const needsValueInput = splitMethod !== "EQUAL";

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Add expense</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic details */}
        <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Details</h2>
          <Input
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Dinner, groceries, taxi..."
            required
            autoFocus
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0.01"
              step="0.01"
              required
            />
            <Select
              label="Paid by"
              value={paidById}
              onChange={(e) => setPaidById(e.target.value)}
              options={memberOptions}
              required
            />
          </div>
        </div>

        {/* Split method */}
        <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Split method</h2>
          <SplitMethodSelector value={splitMethod} onChange={setSplitMethod} />
        </div>

        {/* Participants */}
        <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Participants</h2>
            <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
              <input
                type="checkbox"
                checked={rows.every((r) => r.selected)}
                onChange={(e) => toggleAll(e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              All
            </label>
          </div>

          <div className="space-y-2">
            {rows.map((row) => {
              const displayName = row.name || row.email;
              const autoVal = autoValues[row.userId];

              return (
                <div
                  key={row.userId}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                    row.selected ? "border-indigo-200 bg-indigo-50" : "border-gray-100 bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={row.selected}
                    onChange={(e) => updateRow(row.userId, "selected", e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
                    {row.name && <p className="text-xs text-gray-400 truncate">{row.email}</p>}
                  </div>
                  {row.selected && needsValueInput && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {splitMethod === "PERCENTAGE" && (
                        <span className="text-sm text-gray-400">%</span>
                      )}
                      {splitMethod === "CUSTOM" && (
                        <span className="text-sm text-gray-400">$</span>
                      )}
                      {splitMethod === "SHARES" && (
                        <span className="text-sm text-gray-400">×</span>
                      )}
                      <input
                        type="number"
                        value={row.value}
                        onChange={(e) => updateRow(row.userId, "value", e.target.value)}
                        placeholder={splitMethod === "PERCENTAGE" ? "%" : "0"}
                        min="0"
                        step={splitMethod === "SHARES" ? "1" : "0.01"}
                        className="w-20 border border-gray-300 rounded-lg px-2 py-1 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  )}
                  {row.selected && !needsValueInput && autoVal && (
                    <span className="text-sm font-medium text-gray-700 flex-shrink-0">
                      ${autoVal}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Running total indicator for non-equal methods */}
          {needsValueInput && totalAmount > 0 && (
            <div
              className={`flex items-center justify-between text-sm px-3 py-2 rounded-lg ${
                Math.abs(remaining) < 0.01
                  ? "bg-green-50 text-green-700"
                  : "bg-yellow-50 text-yellow-700"
              }`}
            >
              <span>
                {splitMethod === "PERCENTAGE"
                  ? `Total: ${runningTotal.toFixed(1)}% of 100%`
                  : `Allocated: $${runningTotal.toFixed(2)} of $${totalAmount.toFixed(2)}`}
              </span>
              {Math.abs(remaining) >= 0.01 && (
                <span className="font-medium">
                  {splitMethod === "PERCENTAGE"
                    ? `${Math.abs(100 - runningTotal).toFixed(1)}% remaining`
                    : `$${Math.abs(remaining).toFixed(2)} ${remaining > 0 ? "remaining" : "over"}`}
                </span>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => router.back()} className="flex-1">
            Cancel
          </Button>
          <Button
            type="submit"
            loading={saving}
            disabled={!!validationError || !description || !amount}
            className="flex-1"
          >
            Add expense
          </Button>
        </div>
      </form>
    </div>
  );
}
