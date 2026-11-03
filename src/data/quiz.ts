import type { Ionicons } from '@expo/vector-icons';
import type { MascotId } from './mascots';

type Weights = Partial<Record<MascotId, number>>;

export type QuizOption = {
  id: string;
  label: string;
  sub?: string;
  emoji?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  weights?: Weights;
  value?: number;
};

export type QuizQuestion = {
  id: string;
  title: string;
  subtitle?: string;
  multi?: boolean;
  layout?: 'list' | 'grid';
  options: QuizOption[];
};

export const QUIZ: QuizQuestion[] = [
  {
    id: 'goal',
    title: 'What brings you here?',
    subtitle: 'Pick the one that matters most right now.',
    options: [
      { id: 'focus', emoji: '🎯', label: 'Focus on work or study', weights: { byte: 3 } },
      { id: 'offline', emoji: '🌿', label: 'Spend more time offline', weights: { oak: 3 } },
      { id: 'discipline', emoji: '⚡️', label: 'Build discipline and streaks', weights: { volt: 3 } },
      { id: 'understand', emoji: '🔮', label: 'Understand my habits', weights: { sage: 3 } },
      { id: 'sleep', emoji: '🌙', label: 'Sleep better and unwind', weights: { momo: 3 } },
    ],
  },
  {
    id: 'hours',
    title: 'How much time do you spend on your phone daily?',
    subtitle: 'Your honest guess is perfect.',
    options: [
      { id: 'h2', label: 'Under 2 hours', value: 1.5 },
      { id: 'h4', label: '2 – 4 hours', value: 3 },
      { id: 'h6', label: '4 – 6 hours', value: 5 },
      { id: 'h8', label: '6 – 8 hours', value: 7 },
      { id: 'h9', label: 'More than 8 hours', value: 9 },
    ],
  },
  {
    id: 'apps',
    title: 'Which apps pull you in the most?',
    subtitle: 'Select all that apply.',
    multi: true,
    layout: 'grid',
    options: [
      { id: 'tiktok', label: 'TikTok', weights: { volt: 1, momo: 1 } },
      { id: 'instagram', label: 'Instagram', weights: { oak: 1 } },
      { id: 'youtube', label: 'YouTube', weights: { momo: 1 } },
      { id: 'x', label: 'X', weights: { sage: 1 } },
      { id: 'reddit', label: 'Reddit', weights: { sage: 1 } },
      { id: 'snapchat', label: 'Snapchat', weights: { oak: 1 } },
      { id: 'games', label: 'Games', weights: { volt: 1 } },
      { id: 'netflix', label: 'Streaming', weights: { momo: 1 } },
      { id: 'news', label: 'News', weights: { byte: 1 } },
      { id: 'messages', label: 'Messaging', weights: { byte: 1 } },
      { id: 'shopping', label: 'Shopping', weights: { oak: 1 } },
      { id: 'safari', label: 'Browsing', weights: { sage: 1 } },
    ],
  },
  {
    id: 'when',
    title: 'When is it hardest to put your phone down?',
    options: [
      { id: 'morning', icon: 'partly-sunny-outline', label: 'First thing in the morning', weights: { oak: 2 } },
      { id: 'work', icon: 'briefcase-outline', label: 'While I should be working', weights: { byte: 2 } },
      { id: 'evening', icon: 'cafe-outline', label: 'In the evening', weights: { sage: 2 } },
      { id: 'night', icon: 'moon-outline', label: 'Late at night in bed', weights: { momo: 3 } },
      { id: 'allday', icon: 'repeat-outline', label: 'Honestly, all day', weights: { volt: 2 } },
    ],
  },
  {
    id: 'feel',
    title: 'How do you usually feel after a long scroll?',
    options: [
      { id: 'tired', emoji: '😴', label: 'Drained and tired', weights: { momo: 2 } },
      { id: 'guilty', emoji: '😬', label: 'Guilty about lost time', weights: { byte: 2 } },
      { id: 'anxious', emoji: '😵‍💫', label: 'Anxious or overwhelmed', weights: { oak: 2 } },
      { id: 'restless', emoji: '😤', label: 'Restless and unmotivated', weights: { volt: 2 } },
      { id: 'curious', emoji: '🤔', label: 'Curious why I keep doing it', weights: { sage: 2 } },
    ],
  },
  {
    id: 'motivation',
    title: 'What keeps you motivated?',
    options: [
      { id: 'challenges', icon: 'trophy-outline', label: 'Challenges and streaks', weights: { volt: 3 } },
      { id: 'data', icon: 'analytics-outline', label: 'Data and clear insights', weights: { sage: 3 } },
      { id: 'gentle', icon: 'flower-outline', label: 'Gentle, kind reminders', weights: { oak: 2, momo: 1 } },
      { id: 'progress', icon: 'checkmark-circle-outline', label: 'Getting things done', weights: { byte: 3 } },
      { id: 'rest', icon: 'bed-outline', label: 'Feeling rested', weights: { momo: 3 } },
    ],
  },
  {
    id: 'vibe',
    title: 'Pick a vibe for your buddy',
    subtitle: 'Who would you love in your corner?',
    options: [
      { id: 'clever', emoji: '🤖', label: 'Clever and techy', weights: { byte: 4 } },
      { id: 'grounded', emoji: '🌱', label: 'Calm and grounded', weights: { oak: 4 } },
      { id: 'energetic', emoji: '🦊', label: 'Energetic and bold', weights: { volt: 4 } },
      { id: 'wise', emoji: '🦉', label: 'Wise and thoughtful', weights: { sage: 4 } },
      { id: 'cozy', emoji: '🐱', label: 'Cozy and gentle', weights: { momo: 4 } },
    ],
  },
  {
    id: 'age',
    title: 'How old are you?',
    subtitle: 'We use this to personalise your insights.',
    options: [
      { id: 'a1', label: 'Under 18', value: 16 },
      { id: 'a2', label: '18 – 24', value: 21 },
      { id: 'a3', label: '25 – 34', value: 30 },
      { id: 'a4', label: '35 – 44', value: 40 },
      { id: 'a5', label: '45 or older', value: 50 },
    ],
  },
];

export type QuizAnswers = Record<string, string[]>;
