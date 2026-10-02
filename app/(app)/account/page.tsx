"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAuth, updateMeApi } from "@/contexts/AuthContext";
import { getMeApi } from "@/lib/services/auth.service";
import {
  createCheckoutSessionApi,
  createPortalSessionApi,
} from "@/lib/services/billing.service";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Card from "@/components/Card";
import PhoneInput from "@/components/PhoneInput";
import LanguageDropdown from "@/components/LanguageDropdown";

export default function AccountPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, updateUser, logout } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phoneNumber ?? "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [billingLoading, setBillingLoading] = useState(false);
  const [billingError, setBillingError] = useState("");

  const isPremium = !!user?.isPremium;

  // Returning from Stripe Checkout — refetch the user so isPremium reflects the new subscription.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (new URLSearchParams(window.location.search).get("upgraded") !== "true") return;
    getMeApi()
      .then((me) => updateUser(me))
      .catch(() => {});
    window.history.replaceState({}, "", "/account");
  }, [updateUser]);

  async function handleUpgrade() {
    setBillingLoading(true);
    setBillingError("");
    try {
      const { url } = await createCheckoutSessionApi();
      window.location.href = url;
    } catch {
      setBillingError(t("premium.upgradeError"));
      setBillingLoading(false);
    }
  }

  async function handleManageSubscription() {
    setBillingLoading(true);
    setBillingError("");
    try {
      const { url } = await createPortalSessionApi();
      window.location.href = url;
    } catch {
      setBillingError(t("premium.portalError"));
      setBillingLoading(false);
    }
  }

  const renewalDate = user?.subscriptionCurrentPeriodEnd
    ? new Date(user.subscriptionCurrentPeriodEnd).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");
    try {
      const updated = await updateMeApi({
        name: name.trim() || undefined,
        phoneNumber: phone.trim() || undefined,
      });
      updateUser(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError(t("account.errorSave"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6"
      >
        <svg className="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t("common.back")}
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("account.title")}</h1>

      <div className="space-y-4">
        {/* Profile */}
        <Card padding="lg">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-5">{t("account.profileHeading")}</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("account.emailLabel")}</label>
              <div className="border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 text-sm text-gray-500 select-all">
                {user?.email}
              </div>
              <p className="text-xs text-gray-400 mt-1">{t("account.emailCannotChange")}</p>
            </div>

            <Input
              label={t("account.displayNameLabel")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("account.displayNamePlaceholder")}
            />

            <PhoneInput
              label={t("account.phoneLabel")}
              value={phone}
              onChange={setPhone}
            />

            <div className="flex gap-2.5 bg-indigo-50 rounded-xl px-3.5 py-3">
              <svg className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-xs text-indigo-600 leading-relaxed">
                {t("account.privacyNotice")}
              </p>
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <Button type="submit" loading={loading} fullWidth>
              {success ? t("account.saved") : t("account.saveChanges")}
            </Button>
          </form>
        </Card>

        {/* Language */}
        <Card padding="lg">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">{t("account.language")}</h2>
          <LanguageDropdown />
        </Card>

        {/* Plan & billing */}
        <Card padding="lg">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">{t("premium.sectionHeading")}</h2>

          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <p className="text-base font-semibold text-gray-900">
                {isPremium ? t("premium.premium") : t("premium.free")}
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                {isPremium ? t("premium.premiumDesc") : t("premium.freeDesc")}
              </p>
              {isPremium && renewalDate && (
                <p className="text-xs text-gray-400 mt-1">
                  {user?.subscriptionStatus === "canceled"
                    ? t("premium.endsOn", { date: renewalDate })
                    : t("premium.renewsOn", { date: renewalDate })}
                </p>
              )}
            </div>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${
                isPremium ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-500"
              }`}
            >
              {isPremium ? t("premium.premium") : t("premium.free")}
            </span>
          </div>

          {billingError && <p className="text-sm text-red-500 mb-3">{billingError}</p>}

          {isPremium ? (
            <Button variant="secondary" loading={billingLoading} onClick={handleManageSubscription}>
              {t("premium.manageButton")}
            </Button>
          ) : (
            <Button loading={billingLoading} onClick={handleUpgrade}>
              {t("premium.upgradeButton")}
            </Button>
          )}
        </Card>

        {/* Danger zone */}
        <Card padding="lg">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">{t("account.accountHeading")}</h2>
          <button
            onClick={async () => {
              await logout();
              router.push("/login");
            }}
            className="w-full text-start text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
          >
            {t("account.signOut")}
          </button>
        </Card>
      </div>
    </div>
  );
}
