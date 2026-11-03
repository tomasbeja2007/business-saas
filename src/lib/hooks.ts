import { useEffect, useMemo, useState } from 'react';
import { MASCOTS } from '../data/mascots';
import { useApp } from '../store/useApp';
import { estimateHours } from './match';
import { dayKey, getPreviousWeekAverage, getWeek } from './usage';

export function useBuddy() {
  const id = useApp((s) => s.mascotId);
  return MASCOTS[id];
}

/** Re-renders every `ms` so "live" screen-time numbers tick forward. */
export function useNow(ms = 60000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), ms);
    return () => clearInterval(t);
  }, [ms]);
  return now;
}

export function useUsage() {
  const answers = useApp((s) => s.answers);
  const joinedAt = useApp((s) => s.joinedAt);
  const sessions = useApp((s) => s.focusSessions);
  const now = useNow();

  return useMemo(() => {
    const focusMinutesByDay: Record<string, number> = {};
    sessions.forEach((s) => {
      const k = dayKey(new Date(s.startedAt));
      focusMinutesByDay[k] = (focusMinutesByDay[k] ?? 0) + s.minutes;
    });
    const input = { estimateHours: estimateHours(answers), appIds: answers.apps ?? [], joinedAt, focusMinutesByDay, now };
    const week = getWeek(input);
    const today = week[week.length - 1];
    const prevAvg = getPreviousWeekAverage(input);
    const fullDays = week.slice(0, -1);
    const weekAvg = Math.round(fullDays.reduce((a, b) => a + b.total, 0) / Math.max(1, fullDays.length));
    const focusToday = focusMinutesByDay[today.key] ?? 0;
    const focusWeek = week.reduce((a, d) => a + (focusMinutesByDay[d.key] ?? 0), 0);
    return { week, today, prevAvg, weekAvg, focusToday, focusWeek };
  }, [answers, joinedAt, sessions, now]);
}

export function greeting(date = new Date()) {
  const h = date.getHours();
  if (h < 5) return 'Good night';
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}
