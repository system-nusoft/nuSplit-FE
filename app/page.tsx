"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import LanguageDropdown from "@/components/LanguageDropdown";
import Footer from "@/components/Footer";

export default function LandingPage() {
  const { t } = useTranslation();

  const features = [
    {
      icon: "📷",
      title: t("landing.features.scanTitle"),
      description: t("landing.features.scanDescription"),
    },
    {
      icon: "✅",
      title: t("landing.features.confirmTitle"),
      description: t("landing.features.confirmDescription"),
    },
    {
      icon: "🌍",
      title: t("landing.features.currencyTitle"),
      description: t("landing.features.currencyDescription"),
    },
    {
      icon: "💬",
      title: t("landing.features.whatsappTitle"),
      description: t("landing.features.whatsappDescription"),
    },
    {
      icon: "🧮",
      title: t("landing.features.simplifyTitle"),
      description: t("landing.features.simplifyDescription"),
    },
    {
      icon: "📊",
      title: t("landing.features.balancesTitle"),
      description: t("landing.features.balancesDescription"),
    },
  ];

  const quotes = t("landing.quotes", { returnObjects: true }) as string[];
  const quoteEmojis = ["😬", "😅", "🤯", "😤"];

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <Image src="/logo-with-name.png" alt="Spliit" width={1421} height={550} className="h-8 w-auto" style={{ width: 'auto' }} />
        <div className="flex items-center gap-3">
          <LanguageDropdown />
          <Link
            href="/signup"
            className="text-sm font-semibold bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            {t("landing.getStarted")}
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800" />
        {/* subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-6 py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-xs font-semibold px-3 py-1.5 rounded-full mb-8 border border-white/20">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            {t("landing.badge")}
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
            {t("landing.heroTitleLine1")}<br />
            <span className="text-indigo-200">{t("landing.heroTitleHighlight")}</span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-xl mx-auto mb-10 leading-relaxed">
            {t("landing.heroSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-indigo-700 font-bold px-8 py-3.5 rounded-2xl hover:bg-indigo-50 transition-colors text-base shadow-lg"
            >
              {t("landing.testItOut")}
              <span className="rtl:rotate-180">→</span>
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-8 py-3.5 rounded-2xl hover:bg-white/20 transition-colors text-base border border-white/20"
            >
              {t("landing.signIn")}
            </Link>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xsms font-medium text-white mt-2">{t("landing.downloadApp")}</span>
            <div className="flex items-center gap-3 mt-2">
              <button disabled className="cursor-not-allowed">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/app-store.svg" alt={t("landing.appStoreAlt")} className="h-10 w-auto" />
              </button>
              <button disabled className="bg-white rounded-md cursor-not-allowed">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/google-play.webp" alt={t("landing.googlePlayAlt")} className="h-10 w-auto" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-indigo-500 text-sm font-semibold uppercase tracking-widest mb-4">{t("landing.struggleEyebrow")}</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-12">{t("landing.soundFamiliar")}</h2>
          <div className="flex flex-col gap-4 mb-12">
            {quotes.map((text, i) => (
              <div key={text} className="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl px-5 py-4 text-start shadow-sm">
                <span className="text-2xl flex-shrink-0">{quoteEmojis[i]}</span>
                <p className="text-gray-600 text-base italic">{text}</p>
              </div>
            ))}
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {t("landing.disappearLine1")}{" "}
            <span className="text-purple-400 line-through">{t("landing.disappearLine2")}</span>
            {" "}{t("landing.disappearLine3")}
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="bg-blue-100 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{t("landing.featuresTitle")}</h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto">
              {t("landing.featuresSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-indigo-100 hover:shadow-md transition-all"
              >
                <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("landing.ctaTitle")}</h2>
        <p className="text-gray-500 mb-8">
          {t("landing.ctaSubtitle")}
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold px-10 py-4 rounded-2xl hover:bg-indigo-700 transition-colors text-base shadow-lg"
        >
          {t("landing.ctaButton")}
          <span className="rtl:rotate-180">→</span>
        </Link>
      </section>

      <Footer />
    </div>
  );
}
