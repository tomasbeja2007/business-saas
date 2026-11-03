/**
 * Simulated Screen Time data source.
 *
 * Real Screen Time data on iOS requires Apple's FamilyControls / DeviceActivity
 * entitlement and native extensions. Everything in the UI reads from this module,
 * so a native provider can replace it later without touching screens.
 */
import { APPS, APP_ORDER, type AppCategory, type TrackedApp } from '../data/apps';

export type AppUsage = { app: TrackedApp; minutes: number; pickups: number };
export type DayUsage = {
  key: string;
  date: Date;
  label: string;
  total: number;
  pickups: number;
  apps: AppUsage[];
  hourly: number[];
  isToday: boolean;
};

export type UsageInput = {
  estimateHours: number;
  appIds: string[];
  joinedAt: number;
  focusMinutesByDay: Record<string, number>;
  now?: Date;
};

export const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: string) {
  let s = hash(seed) || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 10000) / 10000;
  };
}

// Typical phone-use curve across a day (index = hour).
const HOUR_CURVE = [
  0.6, 0.25, 0.1, 0.05, 0.03, 0.05, 0.25, 0.8, 1.0, 0.7, 0.6, 0.7, 1.0, 0.9, 0.7, 0.7, 0.8, 0.9, 1.0, 1.2, 1.35, 1.5, 1.4, 1.0,
];
const CURVE_SUM = HOUR_CURVE.reduce((a, b) => a + b, 0);

function dayFraction(now: Date) {
  const h = now.getHours() + now.getMinutes() / 60;
  let acc = 0;
  for (let i = 0; i < 24; i++) {
    if (i + 1 <= h) acc += HOUR_CURVE[i];
    else if (i < h) acc += HOUR_CURVE[i] * (h - i);
  }
  return acc / CURVE_SUM;
}

const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function buildDay(input: UsageInput, date: Date, isToday: boolean): DayUsage {
  const key = dayKey(date);
  const r = rng(`${key}:${input.appIds.join(',')}:${input.estimateHours}`);
  const baseline = input.estimateHours * 60;
  const joinedKey = dayKey(new Date(input.joinedAt));
  const daysSinceJoin = Math.max(0, Math.round((date.getTime() - new Date(input.joinedAt).setHours(0, 0, 0, 0)) / 86400000));
  const improvement = key >= joinedKey ? Math.min(0.35, 0.08 + daysSinceJoin * 0.025) : 0;
  const weekendBoost = date.getDay() === 0 || date.getDay() === 6 ? 1.12 : 1;
  let full = baseline * (0.85 + r() * 0.3) * weekendBoost * (1 - improvement);
  const focus = input.focusMinutesByDay[key] ?? 0;
  full = Math.max(25, full - focus * 0.6);

  const fraction = isToday ? dayFraction(input.now ?? new Date()) : 1;
  const total = Math.round(full * fraction);

  const ids = input.appIds.length ? input.appIds : ['instagram', 'youtube', 'tiktok'];
  const pool = [...new Set([...ids, 'messages', 'safari', 'mail'])].filter((id) => APPS[id]);
  const weights = pool.map((id) => APPS[id].weight * (ids.includes(id) ? 1.6 : 0.6) * (0.7 + r() * 0.6));
  const wSum = weights.reduce((a, b) => a + b, 0);
  const apps = pool
    .map((id, i) => {
      const minutes = Math.round((total * weights[i]) / wSum);
      return { app: APPS[id], minutes, pickups: Math.max(1, Math.round(minutes / (4 + r() * 6))) };
    })
    .filter((a) => a.minutes > 0)
    .sort((a, b) => b.minutes - a.minutes);

  const nowH = isToday ? (input.now ?? new Date()).getHours() : 23;
  const raw = HOUR_CURVE.map((c, h) => (h <= nowH ? c * (0.6 + r() * 0.8) : 0));
  const rawSum = raw.reduce((a, b) => a + b, 0) || 1;
  const hourly = raw.map((v) => Math.round((v / rawSum) * total));

  return {
    key,
    date,
    label: WEEKDAY[date.getDay()],
    total,
    pickups: apps.reduce((a, b) => a + b.pickups, 0),
    apps,
    hourly,
    isToday,
  };
}

export function getWeek(input: UsageInput): DayUsage[] {
  const now = input.now ?? new Date();
  const days: DayUsage[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() - i);
    days.push(buildDay(input, d, i === 0));
  }
  return days;
}

export function getPreviousWeekAverage(input: UsageInput) {
  const now = input.now ?? new Date();
  let sum = 0;
  for (let i = 13; i >= 7; i--) {
    const d = new Date(now);
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() - i);
    sum += buildDay({ ...input, joinedAt: Date.now() + 86400000 * 30 }, d, false).total;
  }
  return Math.round(sum / 7);
}

export function byCategory(day: DayUsage) {
  const map = new Map<AppCategory, number>();
  day.apps.forEach((a) => map.set(a.app.category, (map.get(a.app.category) ?? 0) + a.minutes));
  return [...map.entries()].map(([category, minutes]) => ({ category, minutes })).sort((a, b) => b.minutes - a.minutes);
}

export function formatMinutes(min: number, compact = false) {
  const m = Math.max(0, Math.round(min));
  const h = Math.floor(m / 60);
  const r = m % 60;
  if (compact) return h ? `${h}h${r ? ` ${r}m` : ''}` : `${r}m`;
  if (!h) return `${r} min`;
  return r ? `${h}h ${r}m` : `${h}h`;
}

export const ALL_APP_IDS = APP_ORDER;
