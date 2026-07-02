"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, updateMeApi } from "@/contexts/AuthContext";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Card from "@/components/Card";
import PhoneInput from "@/components/PhoneInput";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phoneNumber ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const updated = await updateMeApi({ name: name.trim() || undefined, phoneNumber: phone.trim() || undefined });
      updateUser(updated);
      router.push("/groups");
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎉</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to nuSplit!</h1>
          <p className="text-gray-500 text-sm mt-1">Just a couple of quick things to set you up.</p>
        </div>

        <Card padding="lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Your display name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="How should others see you?"
              autoFocus
            />

            <PhoneInput
              label="Phone number (optional)"
              value={phone}
              onChange={setPhone}
            />

            {/* Privacy notice */}
            <div className="flex gap-2.5 bg-indigo-50 rounded-xl px-3.5 py-3">
              <svg className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-xs text-indigo-600 leading-relaxed">
                Your phone number is only used so group members can send you WhatsApp payment reminders.
                It is never shared with third parties or used for marketing.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <Button type="submit" fullWidth loading={loading} size="lg">
              Let&apos;s go
            </Button>
            <button
              type="button"
              onClick={() => router.push("/groups")}
              className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Skip for now
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}
