"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { GroupDetail, Expense, PaginatedResponse } from "@/types";
import { getGroupApi, createInviteApi } from "@/lib/services/groups.service";
import { getExpensesApi, deleteExpenseApi } from "@/lib/services/expenses.service";
import ExpenseListItem from "@/components/expenses/ExpenseListItem";
import MemberAvatarStack from "@/components/groups/MemberAvatarStack";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Spinner from "@/components/Spinner";
import Modal from "@/components/Modal";

export default function GroupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [expenses, setExpenses] = useState<PaginatedResponse<Expense> | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    const [g, e] = await Promise.all([
      getGroupApi(id),
      getExpensesApi(id, 1),
    ]);
    setGroup(g);
    setExpenses(e);
  }, [id]);

  useEffect(() => {
    fetchData().finally(() => setLoading(false));
  }, [fetchData]);

  async function loadMore() {
    const next = page + 1;
    const more = await getExpensesApi(id, next);
    setExpenses((prev) =>
      prev ? { ...more, data: [...prev.data, ...more.data] } : more
    );
    setPage(next);
  }

  async function handleInvite() {
    setInviteLoading(true);
    try {
      const { token } = await createInviteApi(id);
      setInviteToken(token);
      setShowInviteModal(true);
    } finally {
      setInviteLoading(false);
    }
  }

  async function handleDeleteExpense(expenseId: string) {
    if (!confirm("Delete this expense?")) return;
    await deleteExpenseApi(id, expenseId);
    setExpenses((prev) =>
      prev
        ? { ...prev, data: prev.data.filter((e) => e.id !== expenseId), total: prev.total - 1 }
        : prev
    );
  }

  const inviteUrl = inviteToken
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/invite/${inviteToken}`
    : "";

  function copyInvite() {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" className="text-indigo-600" />
      </div>
    );
  }

  if (!group) return null;

  const hasMoreExpenses = expenses && expenses.data.length < expenses.total;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
          style={{ backgroundColor: group.avatarColor + "22" }}
        >
          {group.emoji ?? <span className="w-7 h-7 rounded-full block" style={{ backgroundColor: group.avatarColor }} />}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 truncate">{group.name}</h1>
          <MemberAvatarStack members={group.members} />
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button variant="secondary" size="sm" onClick={handleInvite} loading={inviteLoading}>
            Invite
          </Button>
          <Link href={`/groups/${id}/add-expense`}>
            <Button size="sm">+ Add expense</Button>
          </Link>
        </div>
      </div>

      {/* Members */}
      <Card padding="md">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Members · {group.members.length}
        </h2>
        <div className="space-y-2">
          {group.members.map((m) => (
            <div key={m.id} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-semibold text-indigo-700">
                {(m.name || m.email)[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{m.name || m.email}</p>
                {m.name && <p className="text-xs text-gray-400">{m.email}</p>}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Expenses */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Expenses {expenses ? `· ${expenses.total}` : ""}
          </h2>
          <Link href={`/groups/${id}/add-expense`}>
            <button className="text-sm text-indigo-600 font-medium hover:underline">
              + Add
            </button>
          </Link>
        </div>

        {!expenses || expenses.data.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">No expenses yet.</p>
            <Link href={`/groups/${id}/add-expense`}>
              <Button variant="ghost" size="sm" className="mt-2">
                Add the first expense
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {expenses.data.map((expense) => (
              <ExpenseListItem
                key={expense.id}
                expense={expense}
                onDelete={handleDeleteExpense}
              />
            ))}
            {hasMoreExpenses && (
              <div className="text-center pt-3">
                <Button variant="ghost" size="sm" onClick={loadMore}>
                  Load more
                </Button>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Invite modal */}
      <Modal open={showInviteModal} onClose={() => setShowInviteModal(false)} title="Invite link">
        <p className="text-sm text-gray-500 mb-4">
          Share this link with anyone you want to add to <strong>{group.name}</strong>. It expires in 7 days.
        </p>
        <div className="flex gap-2">
          <input
            readOnly
            value={inviteUrl}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-gray-50 truncate"
          />
          <Button onClick={copyInvite} size="md" variant={copied ? "secondary" : "primary"}>
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
