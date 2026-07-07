"use client";

import React, { useState, useEffect } from "react";
import { Group } from "@/types";
import { getGroupsApi } from "@/lib/services/groups.service";
import GroupCard from "@/components/groups/GroupCard";
import CreateGroupModal from "@/components/groups/CreateGroupModal";
import Button from "@/components/Button";
import Spinner from "@/components/Spinner";

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    getGroupsApi()
      .then(setGroups)
      .finally(() => setLoading(false));
  }, []);

  function handleGroupCreated(group: Group) {
    setGroups((prev) => [group, ...prev]);
    setShowCreate(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Groups</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {groups.length === 0 ? "No groups yet" : `${groups.length} group${groups.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)} size="md">
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

      <CreateGroupModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={handleGroupCreated}
      />
    </div>
  );
}
