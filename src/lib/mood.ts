import { colors } from '../theme/tokens';

export type Mood = { label: string; emoji: string; color: string; bg: string; line: string };

/** Buddy mood is driven by how today's usage compares to the goal so far. */
export function moodFor(used: number, goal: number): Mood {
  const r = used / Math.max(1, goal);
  if (r < 0.5) return { label: 'Thriving', emoji: '🤩', color: colors.success, bg: colors.successSoft, line: 'You’re crushing it today!' };
  if (r < 0.85) return { label: 'Happy', emoji: '😊', color: colors.success, bg: colors.successSoft, line: 'Nicely on track. Keep it up!' };
  if (r < 1) return { label: 'Careful', emoji: '😯', color: colors.warning, bg: colors.warningSoft, line: 'Getting close to your goal…' };
  return { label: 'Worn out', emoji: '😵', color: colors.danger, bg: colors.dangerSoft, line: 'We went over today. Let’s reset together.' };
}
