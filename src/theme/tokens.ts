import type { TextStyle, ViewStyle } from 'react-native';

/**
 * Lumi design tokens.
 * Warm paper canvas, deep ink text, soft pastel surfaces — each buddy brings its own accent.
 * 8pt grid, 44pt minimum touch targets, rounded "soft-3D" feel to match the mascots.
 */
export const colors = {
  canvas: '#F7F4EF',
  canvasDeep: '#EFEAE2',
  surface: '#FFFFFF',
  surfaceMuted: '#FBF9F6',
  hairline: 'rgba(28,27,46,0.08)',
  hairlineStrong: 'rgba(28,27,46,0.14)',

  ink: '#1C1B2E',
  inkSoft: '#4A4960',
  inkMute: '#8C8A9E',
  inkFaint: '#B9B7C6',
  onAccent: '#FFFFFF',

  primary: '#5B5BD6',
  primaryPressed: '#4848C2',
  primarySoft: '#ECECFB',

  success: '#3FA36B',
  successSoft: '#E3F4EA',
  warning: '#F0A33A',
  warningSoft: '#FDF1DE',
  danger: '#E5544B',
  dangerSoft: '#FCE6E4',

  gold: '#F2B640',
  goldSoft: '#FDF3DC',

  night: '#17162A',
  nightSurface: '#24233D',
  nightSurface2: '#2F2E4D',
} as const;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

export const fonts = {
  regular: 'Nunito_500Medium',
  semibold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  extrabold: 'Nunito_800ExtraBold',
  black: 'Nunito_900Black',
} as const;

const tabular: TextStyle = { fontVariant: ['tabular-nums'] };

export const type = {
  display: { fontFamily: fonts.black, fontSize: 40, lineHeight: 46, letterSpacing: -0.8 },
  largeTitle: { fontFamily: fonts.extrabold, fontSize: 32, lineHeight: 38, letterSpacing: -0.6 },
  title1: { fontFamily: fonts.extrabold, fontSize: 26, lineHeight: 32, letterSpacing: -0.4 },
  title2: { fontFamily: fonts.extrabold, fontSize: 22, lineHeight: 28, letterSpacing: -0.3 },
  title3: { fontFamily: fonts.bold, fontSize: 19, lineHeight: 25, letterSpacing: -0.2 },
  headline: { fontFamily: fonts.bold, fontSize: 17, lineHeight: 22 },
  body: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 23 },
  bodyStrong: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 23 },
  callout: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 21 },
  subhead: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 19 },
  footnote: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: fonts.bold, fontSize: 12, lineHeight: 16 },
  overline: { fontFamily: fonts.extrabold, fontSize: 12, lineHeight: 16, letterSpacing: 1.1, textTransform: 'uppercase' },
  button: { fontFamily: fonts.extrabold, fontSize: 17, lineHeight: 22 },
  stat: { fontFamily: fonts.black, fontSize: 34, lineHeight: 38, letterSpacing: -0.8, ...tabular },
  statSm: { fontFamily: fonts.extrabold, fontSize: 22, lineHeight: 26, letterSpacing: -0.4, ...tabular },
  timer: { fontFamily: fonts.black, fontSize: 64, lineHeight: 70, letterSpacing: -1.5, ...tabular },
} satisfies Record<string, TextStyle>;

export const shadow = {
  card: {
    shadowColor: '#2A2540',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  raised: {
    shadowColor: '#2A2540',
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  button: {
    shadowColor: '#2A2540',
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
} satisfies Record<string, ViewStyle>;

export const hitSlop = { top: 10, bottom: 10, left: 10, right: 10 };
