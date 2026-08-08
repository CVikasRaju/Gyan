"use client";

import React, { useState } from "react";
import { submitQuizAttempt } from "@/app/actions";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  Home,
  PenLine,
} from "lucide-react";

type Quiz = {
  id: string;
  question: string;
  options: string[];
  correct_option_index: number;
  explanation?: string | null;
  difficulty?: string | null;
};

export function QuizClient({ initialQuizzes }: { initialQuizzes: Quiz[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleNext = async () => {
    if (currentIndex < initialQuizzes.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setCompleted(true);
    }
  };

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleSubmit = async () => {
    if (selectedOption === null || isAnswered) return;
    const correct = selectedOption === initialQuizzes[currentIndex].correct_option_index;
    if (correct) setScore((s) => s + 1);
    setIsAnswered(true);
    await submitQuizAttempt(initialQuizzes[currentIndex].id, correct);
  };

  /* ── Empty state ── */
  if (initialQuizzes.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-raised">
          <PenLine size={26} className="text-ink-muted" aria-hidden />
        </span>
        <h1 className="text-h1 mt-6 text-ink">No quizzes today</h1>
        <p className="mt-2 max-w-[380px] text-body text-ink-secondary">
          Our AI is generating fresh questions from the latest briefings. Check back after
          the next pipeline run.
        </p>
        <Link href="/" className="btn btn-primary mt-8">
          Return to dashboard
        </Link>
      </div>
    );
  }

  /* ── Completed ── */
  if (completed) {
    const percentage = Math.round((score / initialQuizzes.length) * 100);
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-accent-muted ring-1 ring-accent/40">
          <Trophy size={34} className="text-accent" aria-hidden />
          <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-success text-[11px] font-bold text-ink-inverse">
            {score}
          </span>
        </span>
        <h1 className="text-display mt-6 text-ink">Quiz completed</h1>
        <p className="mt-3 text-body-lg text-ink-secondary">
          You scored{" "}
          <span className="font-bold text-accent">
            {score} / {initialQuizzes.length}
          </span>{" "}
          ({percentage}%)
        </p>

        <div className="mt-6 h-2 w-[260px] overflow-hidden rounded-full bg-raised">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            <Home size={16} strokeWidth={2} />
            Dashboard
          </Link>
          <button onClick={() => window.location.reload()} className="btn btn-ghost">
            <RotateCcw size={16} strokeWidth={2} />
            Retake quiz
          </button>
        </div>
      </div>
    );
  }

  const currentQuiz = initialQuizzes[currentIndex];
  const total = initialQuizzes.length;
  const progress = ((currentIndex + (isAnswered ? 1 : 0)) / total) * 100;

  return (
    <div className="mx-auto max-w-[760px] px-6 py-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-label text-ink-muted">Daily quiz</p>
          <h1 className="text-h1 mt-1 text-ink">
            Question {currentIndex + 1} <span className="text-ink-muted">of {total}</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2">
          <Award size={16} className="text-warning" aria-hidden />
          <span className="text-caption font-semibold text-ink">{score * 10} XP</span>
        </div>
      </header>

      {/* Progress */}
      <div className="mb-10 h-1.5 overflow-hidden rounded-full bg-raised">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question card */}
      <div className="card overflow-hidden">
        <div className="p-8 lg:p-10">
          <span className="chip chip-general mb-6">
            {currentQuiz.difficulty || "medium"}
          </span>
          <h2 className="text-h1 leading-snug text-ink">{currentQuiz.question}</h2>

          <div className="mt-8 space-y-3">
            {currentQuiz.options.map((option: string, i: number) => {
              let cls = "border-line bg-transparent hover:bg-raised hover:border-line-strong";
              let letterCls = "bg-raised text-ink-secondary group-hover:bg-overlay group-hover:text-ink";
              let icon = null;

              if (isAnswered) {
                if (i === currentQuiz.correct_option_index) {
                  cls = "border-success/60 bg-success-muted";
                  letterCls = "bg-success text-ink-inverse";
                  icon = <CheckCircle2 size={18} className="ml-auto shrink-0 text-success" />;
                } else if (i === selectedOption) {
                  cls = "border-danger/60 bg-danger-muted";
                  letterCls = "bg-danger text-ink-inverse";
                  icon = <XCircle size={18} className="ml-auto shrink-0 text-danger" />;
                } else {
                  cls = "border-line opacity-40";
                }
              } else if (selectedOption === i) {
                cls = "border-accent bg-accent-muted/40";
                letterCls = "bg-accent text-ink-inverse";
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={`group flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all ${cls}`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold transition-colors ${letterCls}`}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-body font-medium text-ink">{option}</span>
                  {icon}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-4 border-t border-line-subtle bg-surface/60 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            {isAnswered && (
              <div className="animate-in slide-in-from-bottom-2 duration-300">
                <p className="text-label text-ink-muted">Explanation</p>
                <p className="mt-1 text-body-sm italic text-ink-secondary">
                  {currentQuiz.explanation || "That's correct based on today's briefing."}
                </p>
              </div>
            )}
          </div>
          <div className="shrink-0">
            {!isAnswered ? (
              <button
                disabled={selectedOption === null}
                onClick={handleSubmit}
                className="btn btn-primary w-full sm:w-auto"
              >
                Submit answer
              </button>
            ) : (
              <button onClick={handleNext} className="btn btn-primary w-full sm:w-auto">
                {currentIndex === total - 1 ? "Finish quiz" : "Next question"}
                <ArrowRight size={16} strokeWidth={2} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
