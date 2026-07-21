"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Group } from "@/types";
import Card from "@/components/Card";

interface GroupCardProps {
  group: Group;
}

export default function GroupCard({ group }: GroupCardProps) {
  const { t } = useTranslation();
  return (
    <Link href={`/groups/${group.id}`} className="block">
      <Card className="hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ backgroundColor: group.avatarColor + "22" }}
          >
            {group.emoji ?? (
              <span
                className="w-6 h-6 rounded-full block"
                style={{ backgroundColor: group.avatarColor }}
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">{group.name}</p>
            <p className="text-sm text-gray-500">
              {t("groups.member", { count: group.memberCount })}
            </p>
          </div>
          <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Card>
    </Link>
  );
}
