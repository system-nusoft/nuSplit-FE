"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <svg className="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t("auth.backHome")}
          </Link>
        </div>
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo-with-name.png" alt="Spliit" width={1421} height={550} className="h-10 w-auto mb-2" style={{ width: 'auto' }} />
          <p className="text-gray-500 text-sm">{t("auth.tagline")}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
