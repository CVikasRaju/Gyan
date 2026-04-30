import React from 'react';
import { fetchDailyQuizzes } from '@/lib/data';
import { QuizClient } from './QuizClient';

export const revalidate = 0; // Don't cache quiz page

export default async function QuizPage() {
  const quizzes = await fetchDailyQuizzes();

  return (
    <QuizClient initialQuizzes={quizzes} />
  );
}
