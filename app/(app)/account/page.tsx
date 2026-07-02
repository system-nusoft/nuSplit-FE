"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, updateMeApi } from "@/contexts/AuthContext";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Card from "@/components/Card";
import PhoneInput from "@/components/PhoneInput";

export default function AccountPage() {
  const router = useRouter();
  const { user, updateUser, logout } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phoneNumber ?? "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

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
      setError("Failed to save changes. Please try again.");
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
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Account settings</h1>

      <div className="space-y-4">
        {/* Profile */}
        <Card padding="lg">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-5">Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 text-sm text-gray-500 select-all">
                {user?.email}
              </div>
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
            </div>

            <Input
              label="Display name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />

            <PhoneInput
              label="Phone number"
              value={phone}
              onChange={setPhone}
            />

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
              <p className="text-sm text-red-500">{error}</p>
            )}

            <Button type="submit" loading={loading} fullWidth>
              {success ? "Saved!" : "Save changes"}
            </Button>
          </form>
        </Card>

        {/* Danger zone */}
        <Card padding="lg">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Account</h2>
          <button
            onClick={async () => {
              await logout();
              router.push("/login");
            }}
            className="w-full text-left text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
          >
            Sign out
          </button>
        </Card>
      </div>
    </div>
  );
}
