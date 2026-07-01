"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { GroupDetail, Expense, PaginatedResponse, BalancesResponse, Settlement } from "@/types";
import { getGroupApi, createInviteApi, getBalancesApi } from "@/lib/services/groups.service";
import { getExpensesApi, deleteExpenseApi } from "@/lib/services/expenses.service";
import ExpenseListItem from "@/components/expenses/ExpenseListItem";
import SettlementListItem from "@/components/expenses/SettlementListItem";
import ExpenseComments from "@/components/expenses/ExpenseComments";
import MemberAvatarStack from "@/components/groups/MemberAvatarStack";
import BalancesCard from "@/components/groups/BalancesCard";
import GroupSettingsModal from "@/components/groups/GroupSettingsModal";
import ConfirmModal from "@/components/ConfirmModal";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Spinner from "@/components/Spinner";
import Modal from "@/components/Modal";
import { useAuth } from "@/contexts/AuthContext";

type TimelineItem =
  | { kind: "expense"; data: Expense }
  | { kind: "settlement"; data: Settlement };

function buildTimeline(expenses: Expense[], settlements: Settlement[]): TimelineItem[] {
  const items: TimelineItem[] = [
    ...expenses.map((e): TimelineItem => ({ kind: "expense", data: e })),
    ...settlements.map((s): TimelineItem => ({ kind: "settlement", data: s })),
  ];
  return items.sort(
    (a, b) =>
      new Date(b.data.createdAt).getTime() - new Date(a.data.createdAt).getTime()
  );
}

export default function GroupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [expenses, setExpenses] = useState<PaginatedResponse<Expense> | null>(null);
  const [balances, setBalances] = useState<BalancesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    const [g, e, b] = await Promise.all([
      getGroupApi(id),
      getExpensesApi(id, 1),
      getBalancesApi(id),
    ]);
    setGroup(g);
    setExpenses(e);
    setBalances(b);
  }, [id]);

  useEffect(() => {
    fetchData().finally(() => setLoading(false));
  }, [fetchData]);

  const refreshBalances = useCallback(async () => {
    const [e, b] = await Promise.all([getExpensesApi(id, 1), getBalancesApi(id)]);
    setExpenses(e);
    setBalances(b);
    setPage(1);
  }, [id]);

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
    setDeleteTarget(expenseId);
  }

  async function confirmDeleteExpense() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteExpenseApi(id, deleteTarget);
      setExpenses((prev) =>
        prev
          ? { ...prev, data: prev.data.filter((e) => e.id !== deleteTarget), total: prev.total - 1 }
          : prev
      );
      refreshBalances();
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
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

  const timeline = buildTimeline(
    expenses?.data ?? [],
    balances?.settlements ?? []
  );
  const hasMoreExpenses = expenses && expenses.data.length < expenses.total;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
          style={{ backgroundColor: group.avatarColor + "22" }}
        >
          {group.emoji ?? (
            <span className="w-7 h-7 rounded-full block" style={{ backgroundColor: group.avatarColor }} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 truncate">{group.name}</h1>
          <MemberAvatarStack members={group.members} />
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {group.createdById === user?.id && (
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Group settings"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          )}
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

      {/* Balances */}
      {balances && (
        <BalancesCard
          balances={balances}
          groupId={id}
          baseCurrency={group.baseCurrency ?? "USD"}
          onSettled={refreshBalances}
        />
      )}

      {/* Timeline: expenses + settlements interleaved */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Activity {expenses ? `· ${expenses.total + (balances?.settlements.length ?? 0)}` : ""}
          </h2>
          <Link href={`/groups/${id}/add-expense`}>
            <button className="text-sm text-indigo-600 font-medium hover:underline">
              + Add expense
            </button>
          </Link>
        </div>

        {timeline.length === 0 ? (
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
            {timeline.map((item) =>
              item.kind === "expense" ? (
                <div key={`expense-${item.data.id}`}>
                  <ExpenseListItem
                    expense={item.data}
                    baseCurrency={group.baseCurrency}
                    onDelete={handleDeleteExpense}
                  />
                  <ExpenseComments groupId={id} expenseId={item.data.id} />
                </div>
              ) : (
                <SettlementListItem key={`settlement-${item.data.id}`} settlement={item.data} />
              )
            )}
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

      {/* Delete expense confirmation */}
      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDeleteExpense}
        title="Delete expense"
        message="This will permanently remove the expense and update all balances. This cannot be undone."
        confirmLabel="Delete"
        loading={deleting}
      />

      {/* Group settings modal */}
      {showSettings && (
        <GroupSettingsModal
          open={showSettings}
          onClose={() => setShowSettings(false)}
          group={group}
          onUpdated={(updated) => setGroup(updated)}
        />
      )}

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
