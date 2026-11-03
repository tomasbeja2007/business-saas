import type { Ionicons } from '@expo/vector-icons';

export type AppCategory = 'Social' | 'Entertainment' | 'Games' | 'Productivity' | 'News';

export type TrackedApp = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
  category: AppCategory;
  weight: number;
};

export const APPS: Record<string, TrackedApp> = {
  tiktok: { id: 'tiktok', name: 'TikTok', icon: 'logo-tiktok', color: '#FFFFFF', bg: '#111111', category: 'Social', weight: 1.4 },
  instagram: { id: 'instagram', name: 'Instagram', icon: 'logo-instagram', color: '#FFFFFF', bg: '#D63E7A', category: 'Social', weight: 1.2 },
  youtube: { id: 'youtube', name: 'YouTube', icon: 'logo-youtube', color: '#FFFFFF', bg: '#E8322E', category: 'Entertainment', weight: 1.1 },
  x: { id: 'x', name: 'X', icon: 'logo-x', color: '#FFFFFF', bg: '#1A1A1A', category: 'Social', weight: 0.7 },
  reddit: { id: 'reddit', name: 'Reddit', icon: 'logo-reddit', color: '#FFFFFF', bg: '#F25A1F', category: 'Social', weight: 0.8 },
  snapchat: { id: 'snapchat', name: 'Snapchat', icon: 'logo-snapchat', color: '#111111', bg: '#FFE14D', category: 'Social', weight: 0.7 },
  games: { id: 'games', name: 'Games', icon: 'game-controller', color: '#FFFFFF', bg: '#7B61E8', category: 'Games', weight: 0.9 },
  netflix: { id: 'netflix', name: 'Streaming', icon: 'film', color: '#FFFFFF', bg: '#B3122A', category: 'Entertainment', weight: 0.9 },
  news: { id: 'news', name: 'News', icon: 'newspaper', color: '#FFFFFF', bg: '#3B6FD9', category: 'News', weight: 0.5 },
  messages: { id: 'messages', name: 'Messaging', icon: 'chatbubble-ellipses', color: '#FFFFFF', bg: '#2DBE60', category: 'Productivity', weight: 0.6 },
  shopping: { id: 'shopping', name: 'Shopping', icon: 'bag-handle', color: '#FFFFFF', bg: '#F2A33A', category: 'Entertainment', weight: 0.6 },
  safari: { id: 'safari', name: 'Browser', icon: 'compass', color: '#FFFFFF', bg: '#2E8AE6', category: 'Productivity', weight: 0.45 },
  mail: { id: 'mail', name: 'Mail', icon: 'mail', color: '#FFFFFF', bg: '#4A90F0', category: 'Productivity', weight: 0.3 },
};

export const APP_ORDER = Object.keys(APPS);

export const CATEGORY_COLORS: Record<AppCategory, string> = {
  Social: '#E86A92',
  Entertainment: '#F0A33A',
  Games: '#7B61E8',
  Productivity: '#3FA36B',
  News: '#5B7FD6',
};
