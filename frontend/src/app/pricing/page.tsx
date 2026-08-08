import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Ban,
  FileText,
  Check,
  X,
  Sparkles,
  ArrowRight,
  Zap,
} from "lucide-react";
import { Faq } from "@/components/marketing/Faq";

const TIERS = [
  {
    name: "Basic",
    price: 15,
    tagline: "For readers who want a clean, reliable daily briefing.",
    features: [
      "Full daily digest access",
      "Source attribution on every item",
      "Ad-free reading experience",
      "AI summaries (bulk models)",
      "6 category subscriptions",
      "Daily quiz + reading streak",
    ],
    cta: "Start with Basic",
    popular: false,
  },
  {
    name: "Pro",
    price: 30,
    tagline: "For professionals who need deeper, premium analysis.",
    features: [
      "Everything in Basic",
      "Flagship LLM analysis (Claude / GPT)",
      "Advanced geopolitical deep dives",
      "Downloadable PDF briefings",
      "Early access to new categories",
      "Priority editorial review",
    ],
    cta: "Go Pro",
    popular: true,
  },
];

const COMPARISON: { feature: string; basic: boolean | string; pro: boolean | string }[] = [
  { feature: "Daily fact-checked digests", basic: true, pro: true },
  { feature: "Source attribution", basic: true, pro: true },
  { feature: "Ad-free, tracker-free reading", basic: true, pro: true },
  { feature: "Daily quiz & streaks", basic: true, pro: true },
  { feature: "Categories included", basic: "6", pro: "All" },
  { feature: "Flagship model analysis", basic: false, pro: true },
  { feature: "PDF briefings", basic: false, pro: true },
  { feature: "Deep-dive archives", basic: false, pro: true },
];

function Cell({ value }: { value: boolean | string }) {
  if (value === true) {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-success-muted">
        <Check size={13} className="text-success" strokeWidth={2.5} />
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-raised">
        <X size={13} className="text-ink-muted" strokeWidth={2.5} />
      </span>
    );
  }
  return <span className="text-body-sm font-semibold text-ink">{value}</span>;
}

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-16 lg:px-8">
      {/* ── Hero ── */}
      <header className="mx-auto mb-16 max-w-[720px] text-center">
        <p className="text-label text-accent">Simple, honest pricing</p>
        <h1 className="text-display mt-3 text-ink">
          Invest in deep knowledge
        </h1>
        <p className="mt-4 text-body-lg text-ink-secondary">
          No ads. No misinformation. Just fact-checked, source-attributed current affairs —
          powered by AI, guarded by editors.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {[
            { icon: ShieldCheck, label: "Fact-checked" },
            { icon: Ban, label: "No ads" },
            { icon: FileText, label: "Source-attributed" },
          ].map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-body-sm font-medium text-ink-secondary"
            >
              <Icon size={15} className="text-success" aria-hidden />
              {label}
            </span>
          ))}
        </div>
      </header>

      {/* ── Pricing cards ── */}
      <div className="mx-auto mb-20 grid max-w-[880px] grid-cols-1 gap-6 md:grid-cols-2">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`relative flex flex-col rounded-2xl p-8 ${
              tier.popular
                ? "border border-accent bg-accent-muted/30 glow-accent"
                : "border border-line bg-surface"
            }`}
          >
            {tier.popular && (
              <span className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-accent px-4 py-1.5 text-caption font-bold text-ink-inverse shadow-lg">
                <Sparkles size={12} aria-hidden />
                Most popular
              </span>
            )}

            <div className="mb-8">
              <h2 className="text-h1 text-ink">{tier.name}</h2>
              <p className="mt-2 text-body-sm text-ink-secondary">{tier.tagline}</p>
              <div className="mt-6 flex items-end gap-1">
                <span className="text-[40px] font-bold leading-none text-ink">${tier.price}</span>
                <span className="mb-1.5 text-body-sm text-ink-muted">/ month</span>
              </div>
            </div>

            <ul className="mb-10 flex-1 space-y-3">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-body-sm text-ink-secondary">
                  <Check size={15} className="mt-0.5 shrink-0 text-accent" strokeWidth={2.5} />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/login"
              className={`btn w-full ${tier.popular ? "btn-primary" : "btn-secondary"}`}
            >
              {tier.cta}
              <ArrowRight size={16} strokeWidth={2} />
            </Link>
          </div>
        ))}
      </div>

      {/* ── Comparison table ── */}
      <section className="mb-20">
        <h2 className="mb-8 text-center text-h1 text-ink">Compare plans</h2>
        <div className="mx-auto max-w-[680px] overflow-hidden rounded-xl border border-line">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-line bg-surface">
                <th className="px-6 py-4 text-label text-ink-muted">Feature</th>
                <th className="px-6 py-4 text-center text-label text-ink-secondary">Basic</th>
                <th className="px-6 py-4 text-center text-label text-accent">Pro</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr
                  key={row.feature}
                  className={`border-b border-line-subtle last:border-0 ${
                    i % 2 === 0 ? "bg-canvas/40" : "bg-surface"
                  }`}
                >
                  <td className="px-6 py-3.5 text-body-sm text-ink-secondary">{row.feature}</td>
                  <td className="px-6 py-3.5 text-center">
                    <Cell value={row.basic} />
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <Cell value={row.pro} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="mb-20">
        <h2 className="mb-8 text-center text-h1 text-ink">Frequently asked</h2>
        <Faq />
      </section>

      {/* ── CTA strip ── */}
      <section className="relative overflow-hidden rounded-2xl border border-accent/40 bg-gradient-to-br from-accent-muted via-surface to-surface p-12 text-center">
        <Zap
          size={140}
          strokeWidth={1}
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 text-accent/10"
        />
        <h2 className="text-h1 text-ink">Start your free trial</h2>
        <p className="mx-auto mt-3 max-w-[440px] text-body text-ink-secondary">
          Two weeks of Pro, free. No credit card required. Cancel anytime.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/login" className="btn btn-primary">
            Start free trial
            <ArrowRight size={16} strokeWidth={2} />
          </Link>
          <Link href="/" className="btn btn-ghost">
            Read today&apos;s digest first
          </Link>
        </div>
      </section>
    </div>
  );
}
