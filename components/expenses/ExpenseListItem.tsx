"use client";

import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { Expense } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import Badge from "@/components/Badge";

interface ExpenseListItemProps {
  expense: Expense;
  baseCurrency?: string;
  onDelete?: (id: string) => void;
  onRemind?: (id: string) => void;
  isSettled?: boolean;
}

export default function ExpenseListItem({ expense, baseCurrency, onDelete, onRemind, isSettled }: ExpenseListItemProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const METHOD_LABELS: Record<string, string> = {
    EQUAL: t("splitMethod.equal"),
    SHARES: t("splitMethod.shares"),
    PERCENTAGE: t("splitMethod.percentage"),
    CUSTOM: t("splitMethod.custom"),
  };
  const { user } = useAuth();
  const mySplit = expense.splits.find((s) => s.userId === user?.id);
  const iPaid = expense.paidById === user?.id;
  const paidByName = expense.paidBy.name || expense.paidBy.email.split("@")[0];

  const isCross = baseCurrency && expense.currency !== baseCurrency && !!expense.amountInBase;
  const scale = isCross
    ? parseFloat(expense.amountInBase!) / parseFloat(expense.amount)
    : 1;

  return (
    <div className={`flex items-start gap-4 py-4 border-b border-gray-50 last:border-0 rounded-xl px-3 -mx-3 ${isSettled ? 'bg-green-50' : ''}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="font-medium text-gray-900 truncate">{expense.description}</p>
          <Badge color="gray">{METHOD_LABELS[expense.splitMethod]}</Badge>
        </div>
        <p className="text-sm text-gray-500">
          {t("expenseItem.paidBy", { name: iPaid ? t("expenseItem.you") : paidByName })}
          {" · "}
          {new Date(expense.createdAt).toLocaleDateString(language, { month: "short", day: "numeric" })}
        </p>
        {isSettled ? (
          <p className="text-sm text-green-600 font-medium mt-0.5">{t("expenseItem.settled")}</p>
        ) : (
          <>
            {mySplit && !iPaid && (
              <p className="text-sm text-red-600 font-medium mt-0.5">
                {t("expenseItem.youOwe", { currency: expense.currency, amount: parseFloat(mySplit.amountOwed).toFixed(2) })}
                {isCross && (
                  <span className="text-red-400 font-normal">
                    {" "}(≈ {baseCurrency} {(parseFloat(mySplit.amountOwed) * scale).toFixed(2)})
                  </span>
                )}
              </p>
            )}
            {iPaid && user && myplit(expense, user.id) > 0 && (
              <p className="text-sm text-green-600 font-medium mt-0.5">
                {t("expenseItem.othersOweYou", { currency: expense.currency, amount: myplit(expense, user.id).toFixed(2) })}
                {isCross && (
                  <span className="text-green-400 font-normal">
                    {" "}(≈ {baseCurrency} {(myplit(expense, user.id) * scale).toFixed(2)})
                  </span>
                )}
              </p>
            )}
          </>
        )}
      </div>
      <div className="text-end flex-shrink-0">
        <p className="font-semibold text-gray-900">
          {parseFloat(expense.amount).toFixed(2)}
        </p>
        <p className="text-xs text-gray-400">{expense.currency}</p>
        {isCross && (
          <p className="text-xs text-gray-400">
            ≈ {baseCurrency} {parseFloat(expense.amountInBase!).toFixed(2)}
          </p>
        )}
        {onRemind && (
          <button
            onClick={() => onRemind(expense.id)}
            className="flex items-center gap-1 text-xs text-green-500 hover:text-green-700 mt-1 transition-colors"
            title={t("expenseItem.remindTitle")}
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {t("expenseItem.remind")}
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(expense.id)}
            className="text-xs text-red-400 hover:text-red-600 mt-1 transition-colors"
          >
            {t("expenseItem.delete")}
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
