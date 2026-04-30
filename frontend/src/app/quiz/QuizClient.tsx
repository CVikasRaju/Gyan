"use client";

import React, { useState } from 'react';
import { submitQuizAttempt } from '@/app/actions';
import Link from 'next/link';

export function QuizClient({ initialQuizzes }: { initialQuizzes: any[] }) {
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
    if (correct) setScore(score + 1);
    setIsAnswered(true);

    // Record attempt in background
    await submitQuizAttempt(initialQuizzes[currentIndex].id, correct);
  };

  if (initialQuizzes.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-[40px] text-slate-400">quiz</span>
        </div>
        <h2 className="font-headline-xl text-indigo-950 mb-4">No Quizzes Today</h2>
        <p className="font-body-lg text-slate-500 mb-8 max-w-md">
          Check back later! Our AI is busy generating questions from the latest news briefings.
        </p>
        <Link href="/" className="px-8 py-3 bg-primary text-white rounded-xl font-label-md hover:bg-primary/90 transition-all shadow-sm">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  if (completed) {
    const percentage = Math.round((score / initialQuizzes.length) * 100);
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] px-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
          <span className="material-symbols-outlined text-[48px]">emoji_events</span>
        </div>
        <h2 className="font-headline-xl text-indigo-950 mb-2">Quiz Completed!</h2>
        <p className="font-body-lg text-slate-500 mb-8">
          You scored <span className="font-bold text-primary">{score} out of {initialQuizzes.length}</span> ({percentage}%)
        </p>
        <div className="flex gap-4">
          <Link href="/" className="px-8 py-3 bg-primary text-white rounded-xl font-label-md hover:bg-primary/90 transition-all shadow-sm">
            Dashboard
          </Link>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-white border border-slate-200 text-indigo-950 rounded-xl font-label-md hover:bg-slate-50 transition-all"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  const currentQuiz = initialQuizzes[currentIndex];

  return (
    <div className="flex-1 px-gutter py-margin-page bg-slate-50/50 min-h-full">
      <div className="max-w-3xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="font-headline-xl text-indigo-950 mb-1">Daily Quiz</h2>
            <p className="font-body-md text-slate-500">Question {currentIndex + 1} of {initialQuizzes.length}</p>
          </div>
          <div className="px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-500 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
            <span className="font-label-md text-indigo-950">{score * 10} XP Earned</span>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-200 rounded-full mb-12 overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500" 
            style={{ width: `${((currentIndex + (isAnswered ? 1 : 0)) / initialQuizzes.length) * 100}%` }}
          />
        </div>

        <main className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 lg:p-12">
            <h3 className="font-headline-lg text-indigo-950 mb-10 leading-snug">
              {currentQuiz.question}
            </h3>

            <div className="space-y-4">
              {currentQuiz.options.map((option: string, i: number) => {
                let statusClass = "border-slate-100 hover:border-primary/30 hover:bg-slate-50";
                if (isAnswered) {
                  if (i === currentQuiz.correct_option_index) {
                    statusClass = "border-green-500 bg-green-50 text-green-700 ring-1 ring-green-500";
                  } else if (i === selectedOption) {
                    statusClass = "border-red-500 bg-red-50 text-red-700 ring-1 ring-red-500";
                  } else {
                    statusClass = "border-slate-100 opacity-50";
                  }
                } else if (selectedOption === i) {
                  statusClass = "border-primary bg-primary/5 ring-1 ring-primary";
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    className={`w-full p-5 rounded-2xl border-2 text-left transition-all flex items-center gap-4 group ${statusClass}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-colors ${
                      selectedOption === i ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className="font-body-lg font-medium">{option}</span>
                    {isAnswered && i === currentQuiz.correct_option_index && (
                      <span className="material-symbols-outlined ml-auto text-green-600">check_circle</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <div className="flex-1">
              {isAnswered && (
                <div className="animate-in slide-in-from-bottom-2 duration-300">
                  <p className="font-label-sm text-slate-400 uppercase tracking-widest mb-1">Explanation</p>
                  <p className="font-body-md text-slate-600 italic">
                    {currentQuiz.explanation || "That is correct based on today's briefing."}
                  </p>
                </div>
              )}
            </div>
            <div className="ml-8">
              {!isAnswered ? (
                <button
                  disabled={selectedOption === null}
                  onClick={handleSubmit}
                  className="px-10 py-4 bg-primary text-white rounded-2xl font-label-md hover:bg-primary/90 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-10 py-4 bg-indigo-950 text-white rounded-2xl font-label-md hover:bg-indigo-900 transition-all shadow-md flex items-center gap-2"
                >
                  {currentIndex === initialQuizzes.length - 1 ? 'Finish Quiz' : 'Next Question'}
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
