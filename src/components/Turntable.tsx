import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { PanResponder, StyleSheet, View } from 'react-native';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';
import { turnFrames } from '../data/mascotArt';
import type { Mascot } from '../data/mascots';
import { haptic } from '../lib/haptics';
import { colors, spacing } from '../theme/tokens';
import { Squish, T } from './ui';

/** Drag sideways to turn the buddy through its 360° turnaround. Idles with a slow showcase spin. */
export function Turntable({ mascot, size = 190 }: { mascot: Mascot; size?: number }) {
  const frames = turnFrames(mascot.id);
  const n = frames.length;
  const [idx, setIdx] = useState(0);
  const [auto, setAuto] = useState(true);
  const start = useRef(0);
  const idxRef = useRef(0);
  idxRef.current = idx;
  const resume = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % n), 520);
    return () => clearInterval(t);
  }, [auto, n]);

  useEffect(() => () => void (resume.current && clearTimeout(resume.current)), []);

  const pan = useRef(
    PanResponder.create({
      // Claim only horizontal drags so vertical scrolling of the page still works.
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 6 && Math.abs(g.dx) > Math.abs(g.dy) * 1.2,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        setAuto(false);
        if (resume.current) clearTimeout(resume.current);
        start.current = idxRef.current;
      },
      onPanResponderMove: (_, g) => {
        const next = (((start.current - Math.round(g.dx / 26)) % n) + n) % n;
        if (next !== idxRef.current) {
          haptic.select();
          setIdx(next);
        }
      },
      onPanResponderRelease: () => {
        resume.current = setTimeout(() => setAuto(true), 4000);
      },
    }),
  ).current;

  return (
    <View style={{ alignItems: 'center' }}>
      <View {...pan.panHandlers} style={{ width: size, height: size * 1.05, alignItems: 'center', justifyContent: 'flex-end' }}>
        <Svg width={size * 0.75} height={size * 0.14} viewBox="0 0 100 20" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0 }}>
          <Defs>
            <RadialGradient id={`tt-${mascot.id}`} cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0" stopColor={mascot.accentDeep} stopOpacity={0.35} />
              <Stop offset="1" stopColor={mascot.accentDeep} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Ellipse cx="50" cy="10" rx="50" ry="10" fill={`url(#tt-${mascot.id})`} />
        </Svg>
        <View style={{ width: size, height: size }}>
          {frames.map((f, i) => (
            <Image
              key={i}
              source={f.src}
              style={[StyleSheet.absoluteFill, { opacity: i === idx ? 1 : 0, transform: [{ scaleX: f.mirror ? -1 : 1 }] }]}
              contentFit="contain"
            />
          ))}
        </View>
      </View>
      <View style={styles.controls}>
        <View style={styles.dots}>
          {frames.map((_, i) => (
            <View key={i} style={[styles.dot, { backgroundColor: i === idx ? mascot.accent : colors.hairlineStrong, width: i === idx ? 14 : 6 }]} />
          ))}
        </View>
      </View>
      <View style={styles.hintRow}>
        <Ionicons name="hand-left-outline" size={14} color={colors.inkMute} />
        <T variant="caption" color={colors.inkMute}>
          Drag to turn {mascot.name}
        </T>
        <Squish
          onPress={() => setAuto((a) => !a)}
          hapticStyle="select"
          style={[styles.play, { backgroundColor: mascot.accentSoft }]}
          accessibilityLabel={auto ? 'Pause rotation' : 'Play rotation'}
        >
          <Ionicons name={auto ? 'pause' : 'play'} size={12} color={mascot.accentDeep} />
        </Squish>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  controls: { marginTop: spacing.sm },
  dots: { flexDirection: 'row', gap: 5, alignItems: 'center' },
  dot: { height: 6, borderRadius: 3 },
  hintRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.xs },
  play: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginLeft: 4 },
});
