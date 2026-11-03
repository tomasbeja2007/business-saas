import { MASCOT_ORDER, type MascotId } from '../data/mascots';
import { QUIZ, type QuizAnswers } from '../data/quiz';

export type MatchResult = {
  winner: MascotId;
  scores: Record<MascotId, number>;
  percent: number;
  reasons: string[];
};

export function matchBuddy(answers: QuizAnswers): MatchResult {
  const scores = Object.fromEntries(MASCOT_ORDER.map((id) => [id, 0])) as Record<MascotId, number>;
  const reasons: Partial<Record<MascotId, string[]>> = {};

  for (const q of QUIZ) {
    const picked = answers[q.id] ?? [];
    for (const optId of picked) {
      const opt = q.options.find((o) => o.id === optId);
      if (!opt?.weights) continue;
      for (const [m, w] of Object.entries(opt.weights) as [MascotId, number][]) {
        scores[m] += w;
        if (!q.multi && w >= 2) (reasons[m] ??= []).push(opt.label);
      }
    }
  }

  const ranked = [...MASCOT_ORDER].sort((a, b) => scores[b] - scores[a]);
  const winner = ranked[0];
  const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const share = scores[winner] / total;
  const percent = Math.min(98, Math.round(78 + share * 40));

  return { winner, scores, percent, reasons: (reasons[winner] ?? []).slice(0, 3) };
}

export function estimateHours(answers: QuizAnswers) {
  const opt = QUIZ.find((q) => q.id === 'hours')?.options.find((o) => o.id === answers.hours?.[0]);
  return opt?.value ?? 4;
}

export function estimateAge(answers: QuizAnswers) {
  const opt = QUIZ.find((q) => q.id === 'age')?.options.find((o) => o.id === answers.age?.[0]);
  return opt?.value ?? 28;
}

/** Years of remaining waking life spent on the phone, assuming ~80y lifespan. */
export function lifetimeYears(hoursPerDay: number, age: number) {
  const remainingYears = Math.max(10, 80 - age);
  return (hoursPerDay * 365 * remainingYears) / (24 * 365);
}

export function suggestedGoalMinutes(hoursPerDay: number) {
  const target = hoursPerDay * 60 * 0.7;
  return Math.max(60, Math.round(target / 15) * 15);
}
