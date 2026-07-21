"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import Button from "@/components/Button";
import CurrencySelect from "@/components/CurrencySelect";
import { createGroupApi } from "@/lib/services/groups.service";
import { Group } from "@/types";

const EMOJIS = ["🍕", "🍺", "🏖️", "🏠", "✈️", "🎉", "🎮", "🏋️", "🚗", "🎸"];
const COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f97316",
  "#10b981", "#06b6d4", "#f59e0b", "#ef4444",
];

interface CreateGroupModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (group: Group) => void;
}

export default function CreateGroupModal({ open, onClose, onCreated }: CreateGroupModalProps) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError("");
    try {
      const group = await createGroupApi({ name: name.trim(), emoji: emoji || undefined, avatarColor: color, baseCurrency });
      onCreated(group);
      setName("");
      setEmoji("");
      setColor(COLORS[0]);
      setBaseCurrency("USD");
    } catch {
      setError(t("createGroup.errorCreate"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={t("createGroup.title")}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label={t("createGroup.nameLabel")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("createGroup.namePlaceholder")}
          required
          autoFocus
        />

        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">{t("createGroup.emojiLabel")}</p>
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
          <p className="text-sm font-medium text-gray-700 mb-2">{t("createGroup.colorLabel")}</p>
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
          label={t("createGroup.baseCurrencyLabel")}
          value={baseCurrency}
          onChange={setBaseCurrency}
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-3 pt-1">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            {t("createGroup.cancel")}
          </Button>
          <Button type="submit" loading={loading} className="flex-1">
            {t("createGroup.create")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
