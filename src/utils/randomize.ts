import type { Question } from '../types';

/**
 * Shuffle array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Randomize question order for a student
 */
export function randomizeQuestions(questions: Question[], studentId: string): Question[] {
  // Use studentId as seed for consistent randomization per student
  const seed = studentId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Simple seeded random using studentId
  const random = (max: number) => {
    const x = Math.sin(seed + max) * 10000;
    return Math.floor((x - Math.floor(x)) * max);
  };

  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = random(i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

/**
 * Randomize multiple choice options for a question
 */
export function randomizeOptions(question: Question, studentId: string): Question {
  if (question.type !== 'multiple_choice' || !question.options) {
    return question;
  }

  const seed = (studentId + question.id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const random = (max: number) => {
    const x = Math.sin(seed + max) * 10000;
    return Math.floor((x - Math.floor(x)) * max);
  };

  const shuffled = [...question.options];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = random(i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return {
    ...question,
    options: shuffled,
  };
}
