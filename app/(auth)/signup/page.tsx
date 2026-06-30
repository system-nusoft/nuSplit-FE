"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Card from "@/components/Card";

export default function SignupPage() {
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
        "Something went wrong. Please try again.";
      setError(Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card padding="lg">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Create your account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          autoFocus
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          required
          hint="Minimum 8 characters"
        />
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">
            {error}
          </div>
        )}
        <Button type="submit" fullWidth loading={loading} size="lg" className="mt-2">
          Create account
        </Button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-5">
        Already have an account?{" "}
        <Link href="/login" className="text-indigo-600 font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </Card>
  );
}
