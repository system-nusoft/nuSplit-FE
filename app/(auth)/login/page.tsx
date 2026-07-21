"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Card from "@/components/Card";

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      router.push("/groups");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        t("auth.login.errorInvalid");
      // If unverified, redirect to verify-email
      if (typeof msg === "string" && msg.toLowerCase().includes("verify")) {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      } else {
        setError(Array.isArray(msg) ? msg.join(", ") : msg);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card padding="lg">
      <h2 className="text-xl font-bold text-gray-900 mb-6">{t("auth.login.title")}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t("auth.emailLabel")}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          autoFocus
        />
        <Input
          label={t("auth.passwordLabel")}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">
            {error}
          </div>
        )}
        <Button type="submit" fullWidth loading={loading} size="lg" className="mt-2">
          {t("auth.login.submit")}
        </Button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-5">
        {t("auth.login.noAccount")}{" "}
        <Link href="/signup" className="text-indigo-600 font-medium hover:underline">
          {t("auth.login.signUp")}
        </Link>
      </p>
    </Card>
  );
}
