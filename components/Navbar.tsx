"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import Avatar from "./Avatar";
import LanguageDropdown from "./LanguageDropdown";

export default function Navbar() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/groups" className="flex items-center">
          <Image src="/logo-with-name.png" alt="Spliit" width={1421} height={550} className="h-8 w-auto" style={{ width: 'auto' }} />
        </Link>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LanguageDropdown />
          </div>
          {user && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <Avatar name={user.name || user.email} size="sm" />
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute end-0 top-10 z-20 bg-white border border-gray-100 rounded-xl shadow-lg w-52 py-1">
                    <div className="px-4 py-2 border-b border-gray-50">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.name || "Account"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <div className="sm:hidden px-2 py-1 border-b border-gray-50">
                      <LanguageDropdown />
                    </div>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        router.push("/account");
                      }}
                      className="w-full text-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {t("nav.accountSettings")}
                    </button>
                    <button
                      onClick={async () => {
                        setMenuOpen(false);
                        await logout();
                      }}
                      className="w-full text-start px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      {t("nav.signOut")}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
