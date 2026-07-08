import Link from "next/link";

const features = [
  {
    icon: "📷",
    title: "AI Receipt Scanning",
    description:
      "Point your camera at any receipt. Squarr reads it instantly — items, amounts, totals — and pre-fills your expense automatically.",
  },
  {
    icon: "✅",
    title: "Payment Confirmation Flow",
    description:
      "No more guessing if someone actually paid. Mark a payment, the other person confirms. Both sides stay honest.",
  },
  {
    icon: "🌍",
    title: "Multi-Currency Support",
    description:
      "Split expenses across currencies with live exchange rates. Perfect for trips abroad or international friend groups.",
  },
  {
    icon: "💬",
    title: "WhatsApp Reminders",
    description:
      "One tap sends a polite nudge straight to the debtor's WhatsApp. No awkward texts needed — Squarr does it for you.",
  },
  {
    icon: "🧮",
    title: "Smart Debt Simplification",
    description:
      "In a group of 5, you shouldn't need 10 transfers. Squarr calculates the minimum number of payments to settle everyone up.",
  },
  {
    icon: "📊",
    title: "Clear Balances",
    description:
      "See exactly who owes who across every group, with a full activity timeline of expenses and settlements.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <span className="text-xl font-bold text-indigo-600 tracking-tight">Squarr</span>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-semibold bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Get started
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
            AI-powered bill splitting
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
            Split bills without<br />
            <span className="text-indigo-200">the awkward conversation</span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-xl mx-auto mb-10 leading-relaxed">
            Squarr makes shared expenses effortless. Scan a receipt, split it your way,
            and settle up — with AI that does the heavy lifting.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-indigo-700 font-bold px-8 py-3.5 rounded-2xl hover:bg-indigo-50 transition-colors text-base shadow-lg"
            >
              Test it out — it&apos;s free
              <span>→</span>
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-8 py-3.5 rounded-2xl hover:bg-white/20 transition-colors text-base border border-white/20"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Sound familiar?</h2>
        <p className="text-gray-500 text-lg leading-relaxed">
          Someone pays for dinner, someone else covers the Uber, and by the end of the trip no one
          knows who owes who. Spreadsheets get messy. Chasing people is awkward. Most apps make
          it complicated.
        </p>
        <p className="text-indigo-600 font-semibold text-lg mt-6">
          Squarr fixes all of that — in seconds.
        </p>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything you need. Nothing you don&apos;t.</h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto">
              Built for real friend groups, roommates, and travel crews — not accountants.
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
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to stop the guesswork?</h2>
        <p className="text-gray-500 mb-8">
          Sign up free and settle your next shared expense in under a minute.
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold px-10 py-4 rounded-2xl hover:bg-indigo-700 transition-colors text-base shadow-lg"
        >
          Get started for free
          <span>→</span>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-400">
          <span className="font-semibold text-gray-600">Squarr</span>
          <span>© {new Date().getFullYear()} nusoft. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-gray-600 transition-colors">Sign in</Link>
            <Link href="/signup" className="hover:text-gray-600 transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
