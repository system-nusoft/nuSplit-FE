"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { verifyEmailApi, resendOtpApi } from "@/lib/services/auth.service";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Card from "@/components/Card";

function VerifyEmailInner() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") ?? "";
  const { setUserFromTokens } = useAuth();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [resent, setResent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await verifyEmailApi(email, code);
      setUserFromTokens(data.accessToken, data.refreshToken, data.user);
      router.push("/onboarding");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Invalid or expired code.";
      setError(typeof msg === "string" ? msg : "Invalid code");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResending(true);
    try {
      await resendOtpApi(email);
      setResent(true);
    } catch {
      setError("Failed to resend code.");
    } finally {
      setResending(false);
    }
  }

  return (
    <Card padding="lg">
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Check your email</h2>
        <p className="text-sm text-gray-500 mt-1">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-gray-700">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Verification code"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="123456"
          autoFocus
          required
        />
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">
            {error}
          </div>
        )}
        {resent && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-3 py-2">
            A new code has been sent.
          </div>
        )}
        <Button type="submit" fullWidth loading={loading} size="lg" disabled={code.length !== 6}>
          Verify email
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-5">
        Didn&apos;t receive a code?{" "}
        <button
          onClick={handleResend}
          disabled={resending}
          className="text-indigo-600 font-medium hover:underline disabled:opacity-50"
        >
          {resending ? "Sending..." : "Resend"}
        </button>
      </p>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailInner />
    </Suspense>
  );
}
