"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import { createCheckoutSessionApi } from "@/lib/services/billing.service";

interface PremiumUpsellModalProps {
  open: boolean;
  onClose: () => void;
  /** i18n key for the body copy explaining which feature is gated. */
  bodyKey: string;
}

export default function PremiumUpsellModal({ open, onClose, bodyKey }: PremiumUpsellModalProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpgrade() {
    setLoading(true);
    setError("");
    try {
      const { url } = await createCheckoutSessionApi();
      window.location.href = url;
    } catch {
      setError(t("premium.upgradeError"));
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={t("premium.upsellTitle")}>
      <div className="space-y-5">
        <div className="flex gap-3 bg-indigo-50 rounded-xl px-4 py-3.5">
          <span className="text-2xl leading-none">✨</span>
          <p className="text-sm text-indigo-700 leading-relaxed">{t(bodyKey)}</p>
        </div>

        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> {t("premium.perkGroups")}
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> {t("premium.perkReminders")}
          </li>
        </ul>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-2.5">
          <Button variant="secondary" onClick={onClose} fullWidth>
            {t("premium.maybeLater")}
          </Button>
          <Button onClick={handleUpgrade} loading={loading} fullWidth>
            {t("premium.upsellCta")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
