type ImageSourcePropType = number;
import type { Ionicons } from '@expo/vector-icons';

export type MascotId = 'byte' | 'oak' | 'volt' | 'sage' | 'momo';

export type Mascot = {
  id: MascotId;
  name: string;
  species: string;
  role: string;
  tagline: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  image: ImageSourcePropType;
  accent: string;
  accentDeep: string;
  accentSoft: string;
  gradient: [string, string];
  traits: string[];
  superpower: string;
  greetings: string[];
  cheers: string[];
  nudges: string[];
  challenges: { id: string; title: string; detail: string; icon: keyof typeof Ionicons.glyphMap; xp: number }[];
};

export const MASCOTS: Record<MascotId, Mascot> = {
  byte: {
    id: 'byte',
    name: 'Byte',
    species: 'Productivity robot',
    role: 'Your productivity buddy',
    tagline: 'Helps you stay focused and get things done.',
    description:
      'Byte turns distraction into deep work. Expect focus sprints, smart app limits and a little celebration every time you ship something that matters.',
    icon: 'stats-chart',
    image: require('../../assets/mascots/byte.png'),
    accent: '#5B7FD6',
    accentDeep: '#3F62B8',
    accentSoft: '#E8EEFB',
    gradient: ['#E4ECFB', '#F3F0FA'],
    traits: ['Focused', 'Clever', 'Efficient'],
    superpower: 'Focus sprints',
    greetings: ['Systems online. Ready to focus?', 'Let’s make today a deep-work day.', 'Fewer tabs, more wins.'],
    cheers: ['Task complete! Beep boop. 🎉', 'That was a clean sprint.', 'Productivity levels: excellent.'],
    nudges: ['Your focus window is open — want to start a sprint?', 'Social apps are calling. Shall I hold them for 25 min?'],
    challenges: [
      { id: 'byte-1', title: 'Two focus sprints', detail: 'Complete 2 × 25 min focus sessions', icon: 'timer-outline', xp: 40 },
      { id: 'byte-2', title: 'Inbox before feeds', detail: 'No social apps before 11:00', icon: 'mail-open-outline', xp: 30 },
      { id: 'byte-3', title: 'One big thing', detail: 'Write down today’s #1 priority', icon: 'checkmark-done-outline', xp: 20 },
    ],
  },
  oak: {
    id: 'oak',
    name: 'Oak',
    species: 'Forest spirit',
    role: 'Your balance buddy',
    tagline: 'Brings balance to your digital life.',
    description:
      'Oak grows a little every time you choose real life over the scroll. Gentle nudges, mindful pauses and more time outside.',
    icon: 'leaf',
    image: require('../../assets/mascots/oak.png'),
    accent: '#6E9A3A',
    accentDeep: '#527A25',
    accentSoft: '#EAF2DF',
    gradient: ['#E6F0DA', '#F4F2EA'],
    traits: ['Calm', 'Grounded', 'Patient'],
    superpower: 'Mindful pauses',
    greetings: ['Breathe in. Today is a fresh leaf.', 'Let’s grow something good today.', 'Slow is smooth, smooth is calm.'],
    cheers: ['You’re growing beautifully. 🌱', 'That pause made a difference.', 'Rooted and present.'],
    nudges: ['Take a breath before you open that app?', 'A 10 minute walk would make me grow a leaf.'],
    challenges: [
      { id: 'oak-1', title: 'Phone-free meal', detail: 'Eat one meal without your phone', icon: 'restaurant-outline', xp: 30 },
      { id: 'oak-2', title: 'Step outside', detail: 'Spend 15 minutes outdoors, offline', icon: 'sunny-outline', xp: 40 },
      { id: 'oak-3', title: 'Mindful minute', detail: 'One minute of breathing before scrolling', icon: 'leaf-outline', xp: 20 },
    ],
  },
  volt: {
    id: 'volt',
    name: 'Volt',
    species: 'Fox athlete',
    role: 'Your motivator',
    tagline: 'Sets challenges, tracks progress and keeps you consistent.',
    description:
      'Volt is all energy. Daily challenges, streaks you won’t want to break and a coach who never lets you quit on yourself.',
    icon: 'flash',
    image: require('../../assets/mascots/volt.png'),
    accent: '#EE8530',
    accentDeep: '#D26A17',
    accentSoft: '#FDEEDF',
    gradient: ['#FBE7D6', '#F8F1EA'],
    traits: ['Energetic', 'Competitive', 'Loyal'],
    superpower: 'Streaks & challenges',
    greetings: ['Let’s go! Today we win.', 'Streak mode: activated. ⚡️', 'Champions log off on time.'],
    cheers: ['YES! Another one! ⚡️', 'Streak protected. Legend.', 'That’s how winners do it.'],
    nudges: ['Don’t let the scroll steal your streak!', 'Quick challenge: 30 minutes, zero social. You in?'],
    challenges: [
      { id: 'volt-1', title: 'Beat yesterday', detail: 'Use your phone less than yesterday', icon: 'trending-down-outline', xp: 40 },
      { id: 'volt-2', title: '20 push-up break', detail: 'Swap one scroll session for movement', icon: 'barbell-outline', xp: 30 },
      { id: 'volt-3', title: 'Zero-scroll hour', detail: 'One full hour with no social apps', icon: 'flash-outline', xp: 30 },
    ],
  },
  sage: {
    id: 'sage',
    name: 'Sage',
    species: 'Owl wizard',
    role: 'Your insights guide',
    tagline: 'Insights about your screen time to build better routines.',
    description:
      'Sage reads the patterns behind your habits. Weekly reports, gentle wisdom and routines designed around how you actually use your phone.',
    icon: 'sparkles',
    image: require('../../assets/mascots/sage.png'),
    accent: '#7559C9',
    accentDeep: '#5A40AC',
    accentSoft: '#EFEAFB',
    gradient: ['#ECE6FA', '#F5F2F8'],
    traits: ['Wise', 'Curious', 'Thoughtful'],
    superpower: 'Pattern insights',
    greetings: ['Knowledge is the first step to change.', 'Let’s see what your habits are telling us.', 'Every pattern has a story.'],
    cheers: ['A wise choice indeed. ✨', 'The data approves.', 'Your routine is taking shape.'],
    nudges: ['You usually scroll around now. Notice it?', 'Your evenings are your heaviest hours — let’s plan them.'],
    challenges: [
      { id: 'sage-1', title: 'Check your report', detail: 'Review today’s insights', icon: 'analytics-outline', xp: 20 },
      { id: 'sage-2', title: 'Name the trigger', detail: 'Notice why you reached for your phone', icon: 'bulb-outline', xp: 30 },
      { id: 'sage-3', title: 'Read for 15 minutes', detail: 'A book instead of a feed', icon: 'book-outline', xp: 40 },
    ],
  },
  momo: {
    id: 'momo',
    name: 'Momo',
    species: 'Sleepy cat',
    role: 'Your unwind buddy',
    tagline: 'Reduces digital noise and improves your sleep.',
    description:
      'Momo helps you power down. Wind-down routines, quiet notifications and a phone-free bedtime so you wake up actually rested.',
    icon: 'moon',
    image: require('../../assets/mascots/momo.png'),
    accent: '#6C7AC9',
    accentDeep: '#5260AE',
    accentSoft: '#E9ECFA',
    gradient: ['#E4E8F8', '#F1EFF7'],
    traits: ['Cozy', 'Gentle', 'Restful'],
    superpower: 'Wind-down mode',
    greetings: ['Mrrp. Let’s keep today soft and quiet.', 'Less noise, more naps.', 'Gentle day ahead.'],
    cheers: ['Purrfect. 😴', 'So peaceful. Momo is proud.', 'Quiet minds sleep best.'],
    nudges: ['It’s getting late — wind down with me?', 'Phone in another room tonight?'],
    challenges: [
      { id: 'momo-1', title: 'Screens off by 23:00', detail: 'Start wind-down mode before bed', icon: 'moon-outline', xp: 40 },
      { id: 'momo-2', title: 'Silence the noise', detail: 'Mute one noisy group chat', icon: 'notifications-off-outline', xp: 20 },
      { id: 'momo-3', title: 'Phone-free first 30', detail: 'No phone for 30 min after waking', icon: 'cafe-outline', xp: 30 },
    ],
  },
};

export const MASCOT_ORDER: MascotId[] = ['byte', 'oak', 'volt', 'sage', 'momo'];
export const mascotList = MASCOT_ORDER.map((id) => MASCOTS[id]);
