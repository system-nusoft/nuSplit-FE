"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getInvitePreviewApi, acceptInviteApi, InvitePreview } from "@/lib/services/groups.service";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Spinner from "@/components/Spinner";

export default function InvitePage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [preview, setPreview] = useState<InvitePreview | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState("");
  const [previewError, setPreviewError] = useState("");

  useEffect(() => {
    getInvitePreviewApi(token)
      .then(setPreview)
      .catch(() => setPreviewError("This invite link is invalid or has expired."))
      .finally(() => setLoadingPreview(false));
  }, [token]);

  async function handleAccept() {
    if (!user) {
      router.push(`/login?next=/invite/${token}`);
      return;
    }
    setAccepting(true);
    setError("");
    try {
      const group = await acceptInviteApi(token);
      router.push(`/groups/${group.id}`);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to join group.";
      setError(typeof msg === "string" ? msg : "Failed to join group.");
    } finally {
      setAccepting(false);
    }
  }

  if (loadingPreview || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" className="text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">Squarr</h1>
        </div>

        <Card padding="lg">
          {previewError ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Invalid invite</h2>
              <p className="text-sm text-gray-500">{previewError}</p>
            </div>
          ) : preview ? (
            <div>
              <div className="text-center mb-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3"
                  style={{ backgroundColor: preview.avatarColor + "22" }}
                >
                  {preview.emoji ?? (
                    <span
                      className="w-8 h-8 rounded-full block"
                      style={{ backgroundColor: preview.avatarColor }}
                    />
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  You&apos;re invited to join
                </h2>
                <p className="text-2xl font-bold text-indigo-600 mt-1">{preview.groupName}</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2 mb-4">
                  {error}
                </div>
              )}

              {user ? (
                <Button fullWidth loading={accepting} size="lg" onClick={handleAccept}>
                  Join group
                </Button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500 text-center mb-3">
                    Sign in or create an account to join this group.
                  </p>
                  <Button
                    fullWidth
                    size="lg"
                    onClick={() => router.push(`/login?next=/invite/${token}`)}
                  >
                    Sign in to join
                  </Button>
                  <Button
                    fullWidth
                    size="lg"
                    variant="secondary"
                    onClick={() => router.push(`/signup?next=/invite/${token}`)}
                  >
                    Create account
                  </Button>
                </div>
              )}
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
