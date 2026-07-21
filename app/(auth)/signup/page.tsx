"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Card from "@/components/Card";

export default function SignupPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const returnedEmail = await signup(email, password, name);
      router.push(`/verify-email?email=${encodeURIComponent(returnedEmail)}`);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message ||
        t("auth.signup.errorGeneric");
      setError(Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card padding="lg">
      <h2 className="text-xl font-bold text-gray-900 mb-6">{t("auth.signup.title")}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t("auth.signup.nameLabel")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("auth.signup.namePlaceholder")}
          autoFocus
        />
        <Input
          label={t("auth.emailLabel")}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
        <Input
          label={t("auth.passwordLabel")}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t("auth.signup.passwordPlaceholder")}
          required
          hint={t("auth.signup.passwordHint")}
        />
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">
            {error}
          </div>
        )}
        <Button type="submit" fullWidth loading={loading} size="lg" className="mt-2">
          {t("auth.signup.submit")}
        </Button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-5">
        {t("auth.signup.haveAccount")}{" "}
        <Link href="/login" className="text-indigo-600 font-medium hover:underline">
          {t("auth.signup.signIn")}
        </Link>
      </p>
    </Card>
  );
}
