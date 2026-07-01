"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Comment } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { getCommentsApi, createCommentApi, deleteCommentApi } from "@/lib/services/expenses.service";
import Spinner from "@/components/Spinner";

interface ExpenseCommentsProps {
  groupId: string;
  expenseId: string;
}

export default function ExpenseComments({ groupId, expenseId }: ExpenseCommentsProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCommentsApi(groupId, expenseId);
      setComments(data);
    } finally {
      setLoading(false);
    }
  }, [groupId, expenseId]);

  useEffect(() => {
    if (open) fetchComments();
  }, [open, fetchComments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setSubmitting(true);
    try {
      const c = await createCommentApi(groupId, expenseId, body.trim());
      setComments((prev) => [...prev, c]);
      setBody("");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(commentId: string) {
    await deleteCommentApi(groupId, expenseId, commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  }

  return (
    <div className="px-1 pb-1">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-indigo-600 transition-colors mt-1"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        {open ? "Hide comments" : `Comments${comments.length > 0 ? ` (${comments.length})` : ""}`}
      </button>

      {open && (
        <div className="mt-2 space-y-2">
          {loading ? (
            <Spinner size="sm" className="text-indigo-400" />
          ) : comments.length === 0 ? (
            <p className="text-xs text-gray-400">No comments yet.</p>
          ) : (
            comments.map((c) => {
              const isMe = c.userId === user?.id;
              const name = c.user.name || c.user.email.split("@")[0];
              return (
                <div key={c.id} className="flex gap-2 group">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-700 flex-shrink-0 mt-0.5">
                    {name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs font-semibold text-gray-800">{isMe ? "You" : name}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(c.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 break-words">{c.body}</p>
                  </div>
                  {isMe && (
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="opacity-0 group-hover:opacity-100 text-xs text-red-400 hover:text-red-600 transition-all flex-shrink-0"
                    >
                      ×
                    </button>
                  )}
                </div>
              );
            })
          )}

          <form onSubmit={handleSubmit} className="flex gap-2 pt-1">
            <input
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Add a comment…"
              className="flex-1 text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-400 placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={submitting || !body.trim()}
              className="text-xs bg-indigo-600 text-white rounded-lg px-3 py-1.5 font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? "…" : "Post"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
