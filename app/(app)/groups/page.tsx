"use client";

import React, { useState, useEffect } from "react";
import { Group } from "@/types";
import { getGroupsApi, getBalanceOverviewApi } from "@/lib/services/groups.service";
import GroupCard from "@/components/groups/GroupCard";
import CreateGroupModal from "@/components/groups/CreateGroupModal";
import Button from "@/components/Button";
import Spinner from "@/components/Spinner";

interface BalanceOverview {
  payable: Record<string, number>;
  receivable: Record<string, number>;
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [overview, setOverview] = useState<BalanceOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    Promise.all([getGroupsApi(), getBalanceOverviewApi()])
      .then(([g, o]) => { setGroups(g); setOverview(o); })
      .finally(() => setLoading(false));
  }, []);

  function handleGroupCreated(group: Group) {
    setGroups((prev) => [group, ...prev]);
    setShowCreate(false);
  }

  const totalPayable = overview ? Object.entries(overview.payable) : [];
  const totalReceivable = overview ? Object.entries(overview.receivable) : [];

  return (
    <div className="space-y-8">
      {/* Overview */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Overview</h2>
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-red-50 rounded-2xl px-4 py-4 animate-pulse h-20" />
            <div className="bg-blue-50 rounded-2xl px-4 py-4 animate-pulse h-20" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-red-50 rounded-2xl px-4 py-4">
              <p className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-2">Total Payable Amount</p>
              {totalPayable.length === 0 ? (
                <p className="text-xl font-bold text-red-200">—</p>
              ) : totalPayable.map(([cur, amt]) => (
                <p key={cur} className="text-xl font-bold text-red-500 leading-tight">
                  {cur} {amt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              ))}
            </div>
            <div className="bg-blue-50 rounded-2xl px-4 py-4">
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-wide mb-2">Total Receivable Amount</p>
              {totalReceivable.length === 0 ? (
                <p className="text-xl font-bold text-blue-200">—</p>
              ) : totalReceivable.map(([cur, amt]) => (
                <p key={cur} className="text-xl font-bold text-blue-500 leading-tight">
                  {cur} {amt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* My Groups */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">
            My Groups{!loading && groups.length > 0 && ` · ${groups.length}`}
          </h2>
          <Button onClick={() => setShowCreate(true)} size="sm">
            + New group
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner size="lg" className="text-indigo-600" />
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">👥</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No groups yet</h3>
            <p className="text-gray-500 text-sm mb-6">
              Create a group and start splitting bills with friends.
            </p>
            <Button onClick={() => setShowCreate(true)}>Create your first group</Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {groups.map((g) => (
              <GroupCard key={g.id} group={g} />
            ))}
          </div>
        )}
      </div>

      <CreateGroupModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={handleGroupCreated}
      />
    </div>
  );

}
