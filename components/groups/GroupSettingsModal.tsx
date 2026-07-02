"use client";

import React, { useState } from "react";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import Button from "@/components/Button";
import CurrencySelect from "@/components/CurrencySelect";
import { updateGroupApi, removeMemberApi } from "@/lib/services/groups.service";
import { GroupDetail } from "@/types";

const EMOJIS = ["🍕", "🍺", "🏖️", "🏠", "✈️", "🎉", "🎮", "🏋️", "🚗", "🎸"];
const COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f97316",
  "#10b981", "#06b6d4", "#f59e0b", "#ef4444",
];

interface GroupSettingsModalProps {
  open: boolean;
  onClose: () => void;
  group: GroupDetail;
  currentUserId: string;
  onUpdated: (group: GroupDetail) => void;
  onMemberRemoved: (userId: string) => void;
}

export default function GroupSettingsModal({
  open,
  onClose,
  group,
  currentUserId,
  onUpdated,
  onMemberRemoved,
}: GroupSettingsModalProps) {
  const [name, setName] = useState(group.name);
  const [emoji, setEmoji] = useState(group.emoji ?? "");
  const [color, setColor] = useState(group.avatarColor);
  const [baseCurrency, setBaseCurrency] = useState(group.baseCurrency ?? "USD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError("");
    try {
      const updated = await updateGroupApi(group.id, {
        name: name.trim(),
        emoji: emoji,   // send empty string so BE sets it to null
        avatarColor: color,
        baseCurrency,
      });
      // updateGroupApi returns a Group (list shape), merge with GroupDetail
      onUpdated({ ...group, name: updated.name, emoji: updated.emoji, avatarColor: updated.avatarColor, baseCurrency: updated.baseCurrency });
      onClose();
    } catch {
      setError("Failed to save settings.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveMember(memberId: string) {
    setRemovingId(memberId);
    try {
      await removeMemberApi(group.id, memberId);
      onMemberRemoved(memberId);
    } catch {
      setError("Failed to remove member.");
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Group settings">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Group name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />

        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Emoji (optional)</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setEmoji("")}
              className={`w-9 h-9 rounded-lg border-2 text-sm transition-colors ${
                !emoji ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              —
            </button>
            {EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEmoji(e)}
                className={`w-9 h-9 rounded-lg border-2 text-lg transition-colors ${
                  emoji === e ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Color</p>
          <div className="flex gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-7 h-7 rounded-full border-2 transition-transform ${
                  color === c ? "border-gray-900 scale-110" : "border-transparent"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <CurrencySelect
          label="Base currency"
          value={baseCurrency}
          onChange={setBaseCurrency}
        />

        <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
          Changing the base currency affects how balances are displayed going forward. Past expenses already converted are not recalculated.
        </p>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Members</p>
          <div className="space-y-2">
            {group.members.map((m) => {
              const isCreator = m.id === group.createdById;
              const isCurrentUser = m.id === currentUserId;
              return (
                <div key={m.id} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-700 flex-shrink-0">
                      {(m.name || m.email)[0].toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-700 truncate">
                      {m.name || m.email}
                      {isCreator && <span className="text-xs text-gray-400 ml-1">(creator)</span>}
                    </span>
                  </div>
                  {!isCreator && !isCurrentUser && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(m.id)}
                      disabled={removingId === m.id}
                      className="text-xs text-red-400 hover:text-red-600 flex-shrink-0 transition-colors disabled:opacity-50"
                    >
                      {removingId === m.id ? "Removing…" : "Remove"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-3 pt-1">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" loading={loading} className="flex-1">
            Save changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
