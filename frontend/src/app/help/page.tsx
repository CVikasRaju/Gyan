import React from "react";
import Link from "next/link";
import { LifeBuoy, Mail, BookOpen, ShieldCheck, MessageSquare, ChevronRight, CreditCard } from "lucide-react";

const TOPICS = [
  {
    icon: BookOpen,
    title: "Reading & bookmarks",
    body: "How the daily digest works, reading streaks and saving briefings for later.",
  },
  {
    icon: ShieldCheck,
    title: "Fact-checking & sources",
    body: "How every summary is verified against its original source before publishing.",
  },
  {
    icon: MessageSquare,
    title: "Quizzes & XP",
    body: "Earning XP from daily quizzes and how accuracy is calculated on your tracker.",
  },
  {
    icon: CreditCard,
    title: "Plans & billing",
    body: "Basic vs Pro, upgrading, and cancelling anytime with no lock-in.",
  },
];

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-[900px] px-6 py-10 lg:px-8">
      <header className="mb-10 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-muted ring-1 ring-accent/30">
          <LifeBuoy size={24} className="text-accent" aria-hidden />
        </span>
        <p className="text-label mt-5 text-accent">Help center</p>
        <h1 className="text-display mt-2 text-ink">How can we help?</h1>
        <p className="mx-auto mt-3 max-w-[440px] text-body text-ink-secondary">
          Everything you need to know about reading, verifying and tracking current affairs
          on Gyan.
        </p>
      </header>

      <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {TOPICS.map(({ icon: Icon, title, body }) => (
          <Link
            key={title}
            href="/"
            className="card card-hover group flex items-start gap-4 p-6"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-raised ring-1 ring-line">
              <Icon size={18} className="text-ink-secondary" aria-hidden />
            </span>
            <div className="min-w-0">
              <h2 className="flex items-center gap-1 text-h3 text-ink">
                {title}
                <ChevronRight
                  size={14}
                  className="text-ink-muted transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </h2>
              <p className="mt-1.5 text-body-sm text-ink-secondary">{body}</p>
            </div>
          </Link>
        ))}
      </div>

      <section className="flex flex-col items-center rounded-xl border border-line bg-surface p-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-raised">
          <Mail size={20} className="text-ink-secondary" aria-hidden />
        </span>
        <h2 className="text-h2 mt-4 text-ink">Still stuck?</h2>
        <p className="mt-2 max-w-[400px] text-body-sm text-ink-secondary">
          Our operations team replies within one business day. Include your account email
          for the fastest resolution.
        </p>
        <a href="mailto:support@gyan.example" className="btn btn-primary mt-6">
          Contact support
        </a>
      </section>
    </div>
  );
}
