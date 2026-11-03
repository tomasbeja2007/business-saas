import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, IconButton, T } from '../../components/ui';
import { estimateAge, estimateHours, lifetimeYears } from '../../lib/match';
import { useApp } from '../../store/useApp';
import { colors, radius, spacing } from '../../theme/tokens';

function useCountUp(target: number, duration = 1400, delay = 300) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = Date.now() + delay;
    const tick = () => {
      const t = Math.min(1, Math.max(0, (Date.now() - start) / duration));
      setV(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, delay]);
  return v;
}

export default function Insight() {
  const insets = useSafeAreaInsets();
  const answers = useApp((s) => s.answers);
  const hours = estimateHours(answers);
  const age = estimateAge(answers);
  const years = lifetimeYears(hours, age);
  const saved = lifetimeYears(Math.min(hours * 0.4, 2.5), age);
  const shown = useCountUp(years);

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8, paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
      <View style={{ paddingHorizontal: spacing.md }}>
        <IconButton icon="chevron-back" label="Back" onPress={() => router.back()} bg="transparent" color="#fff" />
      </View>
      <View style={{ flex: 1, paddingHorizontal: spacing.xl, justifyContent: 'center' }}>
        <Animated.View entering={FadeIn.duration(500)}>
          <T variant="overline" color="#A9A6FF">
            A quick reality check
          </T>
          <T variant="title2" color="#fff" style={{ marginTop: spacing.sm }}>
            At about {hours < 2 ? 'under 2' : hours >= 9 ? '8+' : hours} hours a day, you’re on track to spend
          </T>
          <View style={styles.statRow}>
            <T style={styles.big} color="#fff">
              {shown.toFixed(1)}
            </T>
            <T variant="title1" color="#fff" style={{ marginBottom: 14 }}>
              years
            </T>
          </View>
          <T variant="title2" color="#fff">
            of your life looking at your phone.
          </T>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(1700).duration(500)} style={styles.good}>
          <View style={styles.goodIcon}>
            <Ionicons name="sparkles" size={20} color={colors.gold} />
          </View>
          <View style={{ flex: 1 }}>
            <T variant="headline" color="#fff">
              The good news
            </T>
            <T variant="callout" color="rgba(255,255,255,0.75)" style={{ marginTop: 2 }}>
              Cutting back by 40% with your buddy would give you about{' '}
              <T variant="callout" color="#fff" style={{ fontFamily: 'Nunito_800ExtraBold' }}>
                {saved.toFixed(1)} years
              </T>{' '}
              back.
            </T>
          </View>
        </Animated.View>
      </View>
      <Animated.View entering={FadeInDown.delay(2000).duration(500)} style={{ paddingHorizontal: spacing.xl }}>
        <Button title="Let’s change that" color="#fff" textColor={colors.night} iconRight="arrow-forward" onPress={() => router.push('/onboarding/matching')} />
        <T variant="caption" color="rgba(255,255,255,0.45)" align="center" style={{ marginTop: spacing.sm }}>
          Estimate based on your answers, assuming waking hours to age 80.
        </T>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.night },
  statRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginVertical: spacing.sm },
  big: { fontFamily: 'Nunito_900Black', fontSize: 96, lineHeight: 104, letterSpacing: -3, fontVariant: ['tabular-nums'] },
  good: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xxl,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.nightSurface,
  },
  goodIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(242,182,64,0.15)', alignItems: 'center', justifyContent: 'center' },
});
