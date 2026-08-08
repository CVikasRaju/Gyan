"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "How is content fact-checked?",
    a: "Every AI summary is cross-checked against its original source by a two-stage QA loop — an automated model comparison followed by a human editorial review for any item that gets flagged. Nothing auto-publishes without passing these checks.",
  },
  {
    q: "Is there really no advertising?",
    a: "Yes. Gyan is subscription-funded. No banner ads, no sponsored content, no trackers — your attention is the product, not the revenue.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Absolutely. Plans are billed monthly with no lock-in. You can downgrade or cancel in one click from your account page, and you keep access until the end of your billing period.",
  },
  {
    q: "What makes the Pro tier different?",
    a: "Pro uses flagship language models for complex geopolitical and long-context analysis, unlocks every category, includes downloadable PDF briefings and early access to deep-dive reports.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-[720px] divide-y divide-line-subtle rounded-xl border border-line bg-surface">
      {FAQS.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div key={faq.q}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-raised/60"
              aria-expanded={isOpen}
            >
              <span className="text-body font-semibold text-ink">{faq.q}</span>
              <ChevronDown
                size={18}
                className={`shrink-0 text-ink-muted transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
                aria-hidden
              />
            </button>
            {isOpen && (
              <p className="animate-in fade-in slide-in-from-top-1 duration-200 px-6 pb-5 text-body-sm leading-relaxed text-ink-secondary">
                {faq.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
