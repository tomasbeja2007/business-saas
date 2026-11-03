import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { MascotId } from '../data/mascots';
import type { QuizAnswers } from '../data/quiz';
import { dayKey } from '../lib/usage';

export type Plan = 'weekly' | 'yearly' | 'lifetime';

export type FocusSession = {
  id: string;
  startedAt: number;
  plannedMinutes: number;
  minutes: number;
  completed: boolean;
  label: string;
};

export type Settings = {
  notifications: boolean;
  dailyReport: boolean;
  windDown: boolean;
  bedtime: string;
  haptics: boolean;
  screenTimeConnected: boolean;
  strictMode: boolean;
};

type State = {
  hydrated: boolean;
  onboarded: boolean;
  name: string;
  answers: QuizAnswers;
  mascotId: MascotId;
  matchPercent: number;
  dailyGoal: number;
  joinedAt: number;
  xp: number;
  plan: Plan | null;
  focusSessions: FocusSession[];
  challengesDone: Record<string, string[]>;
  limits: Record<string, number>;
  blockedApps: string[];
  settings: Settings;
};

type Actions = {
  setName: (name: string) => void;
  setAnswer: (questionId: string, value: string[]) => void;
  setMascot: (id: MascotId, matchPercent?: number) => void;
  setDailyGoal: (min: number) => void;
  setPlan: (plan: Plan) => void;
  completeOnboarding: () => void;
  addFocusSession: (s: Omit<FocusSession, 'id'>) => void;
  toggleChallenge: (challengeId: string, xp: number) => void;
  setLimit: (appId: string, minutes: number | null) => void;
  toggleBlockedApp: (appId: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  addXp: (n: number) => void;
  reset: () => void;
};

const initial: Omit<State, 'hydrated'> = {
  onboarded: false,
  name: '',
  answers: {},
  mascotId: 'byte',
  matchPercent: 92,
  dailyGoal: 180,
  joinedAt: Date.now(),
  xp: 0,
  plan: null,
  focusSessions: [],
  challengesDone: {},
  limits: {},
  blockedApps: [],
  settings: {
    notifications: false,
    dailyReport: true,
    windDown: true,
    bedtime: '23:00',
    haptics: true,
    screenTimeConnected: false,
    strictMode: false,
  },
};

export const useApp = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...initial,
      hydrated: false,
      setName: (name) => set({ name }),
      setAnswer: (questionId, value) => set({ answers: { ...get().answers, [questionId]: value } }),
      setMascot: (mascotId, matchPercent) => set({ mascotId, ...(matchPercent ? { matchPercent } : null) }),
      setDailyGoal: (dailyGoal) => set({ dailyGoal }),
      setPlan: (plan) => set({ plan }),
      completeOnboarding: () => {
        const apps = get().answers.apps ?? [];
        set({ onboarded: true, joinedAt: Date.now(), blockedApps: apps.slice(0, 4) });
      },
      addFocusSession: (s) => {
        const xp = s.completed ? Math.round(s.minutes * 2) : Math.round(s.minutes / 2);
        set({
          focusSessions: [{ ...s, id: `${s.startedAt}` }, ...get().focusSessions],
          xp: get().xp + xp,
        });
      },
      toggleChallenge: (challengeId, xp) => {
        const key = dayKey(new Date());
        const today = get().challengesDone[key] ?? [];
        const done = today.includes(challengeId);
        set({
          challengesDone: {
            ...get().challengesDone,
            [key]: done ? today.filter((c) => c !== challengeId) : [...today, challengeId],
          },
          xp: Math.max(0, get().xp + (done ? -xp : xp)),
        });
      },
      setLimit: (appId, minutes) => {
        const limits = { ...get().limits };
        if (minutes == null) delete limits[appId];
        else limits[appId] = minutes;
        set({ limits });
      },
      toggleBlockedApp: (appId) => {
        const b = get().blockedApps;
        set({ blockedApps: b.includes(appId) ? b.filter((a) => a !== appId) : [...b, appId] });
      },
      updateSettings: (patch) => set({ settings: { ...get().settings, ...patch } }),
      addXp: (n) => set({ xp: get().xp + n }),
      reset: () => set({ ...initial, joinedAt: Date.now() }),
    }),
    {
      name: 'lumi-store-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ hydrated, ...rest }) => rest,
      onRehydrateStorage: () => () => useApp.setState({ hydrated: true }),
    },
  ),
);

export function levelFromXp(xp: number) {
  const per = 120;
  const level = Math.floor(xp / per) + 1;
  return { level, into: xp % per, per, progress: (xp % per) / per };
}

export function activeDayStreak(sessions: FocusSession[], challenges: Record<string, string[]>) {
  const active = new Set<string>();
  sessions.filter((s) => s.completed).forEach((s) => active.add(dayKey(new Date(s.startedAt))));
  Object.entries(challenges).forEach(([k, v]) => v.length && active.add(k));
  let streak = 0;
  const d = new Date();
  if (!active.has(dayKey(d))) d.setDate(d.getDate() - 1);
  while (active.has(dayKey(d))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}
