"use client";

import { Expense } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import Badge from "@/components/Badge";

interface ExpenseListItemProps {
  expense: Expense;
  onDelete?: (id: string) => void;
}

const METHOD_LABELS: Record<string, string> = {
  EQUAL: "Equal",
  SHARES: "By share",
  PERCENTAGE: "By %",
  CUSTOM: "Custom",
};

export default function ExpenseListItem({ expense, onDelete }: ExpenseListItemProps) {
  const { user } = useAuth();
  const mySplit = expense.splits.find((s) => s.userId === user?.id);
  const iPaid = expense.paidById === user?.id;
  const paidByName = expense.paidBy.name || expense.paidBy.email.split("@")[0];

  return (
    <div className="flex items-start gap-4 py-4 border-b border-gray-50 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="font-medium text-gray-900 truncate">{expense.description}</p>
          <Badge color="gray">{METHOD_LABELS[expense.splitMethod]}</Badge>
        </div>
        <p className="text-sm text-gray-500">
          Paid by <span className="font-medium text-gray-700">{iPaid ? "you" : paidByName}</span>
          {" · "}
          {new Date(expense.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
        </p>
        {mySplit && !iPaid && (
          <p className="text-sm text-red-600 font-medium mt-0.5">
            You owe ${parseFloat(mySplit.amountOwed).toFixed(2)}
          </p>
        )}
        {iPaid && myplit(expense, user.id) > 0 && (
          <p className="text-sm text-green-600 font-medium mt-0.5">
            Others owe you ${myplit(expense, user.id).toFixed(2)}
          </p>
        )}
      </div>
      <div className="text-right flex-shrink-0">
        <p className="font-semibold text-gray-900">
          ${parseFloat(expense.amount).toFixed(2)}
        </p>
        <p className="text-xs text-gray-400">{expense.currency}</p>
        {onDelete && (
          <button
            onClick={() => onDelete(expense.id)}
            className="text-xs text-red-400 hover:text-red-600 mt-1 transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

function myplit(expense: Expense, userId: string): number {
  const others = expense.splits.filter((s) => s.userId !== userId);
  return others.reduce((sum, s) => sum + parseFloat(s.amountOwed), 0);
}
