import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { T } from '../../components/ui';
import { MascotArt, Ring } from '../../components/visuals';
import { MASCOTS, MASCOT_ORDER } from '../../data/mascots';
import { haptic } from '../../lib/haptics';
import { matchBuddy } from '../../lib/match';
import { useApp } from '../../store/useApp';
import { colors, radius, spacing } from '../../theme/tokens';

const STEPS = ['Analysing your habits', 'Understanding your goals', 'Matching your personality', 'Finding your perfect buddy'];
const DURATION = 3600;

export default function Matching() {
  const answers = useApp((s) => s.answers);
  const setMascot = useApp((s) => s.setMascot);
  const [i, setI] = useState(0);
  const [done, setDone] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const cycle = setInterval(() => setI((x) => (x + 1) % MASCOT_ORDER.length), 420);
    const stepTimers = STEPS.map((_, k) =>
      setTimeout(() => {
        setDone(k + 1);
        setProgress((k + 1) / STEPS.length);
        haptic.tap();
      }, ((k + 1) * DURATION) / (STEPS.length + 0.4)),
    );
    const finish = setTimeout(() => {
      const r = matchBuddy(answers);
      setMascot(r.winner, r.percent);
      haptic.success();
      router.replace('/onboarding/reveal');
    }, DURATION + 300);
    return () => {
      clearInterval(cycle);
      stepTimers.forEach(clearTimeout);
      clearTimeout(finish);
    };
  }, [answers, setMascot]);

  const m = MASCOTS[MASCOT_ORDER[i]];

  return (
    <View style={styles.root}>
      <Ring size={260} stroke={10} progress={progress} color={colors.primary} colorEnd="#9B8CFF">
        <View style={styles.inner}>
          <Animated.View key={m.id} entering={ZoomIn.duration(220)} style={StyleSheet.absoluteFill}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <MascotArt mascot={m} size={170} float={false} shadow={false} />
            </View>
          </Animated.View>
        </View>
      </Ring>
      <T variant="title1" align="center" style={{ marginTop: spacing.xxl }}>
        Finding your buddy…
      </T>
      <View style={{ marginTop: spacing.xl, gap: spacing.sm, alignSelf: 'stretch', paddingHorizontal: spacing.xxl }}>
        {STEPS.map((s, k) => {
          const isDone = k < done;
          return (
            <Animated.View key={s} entering={FadeIn.delay(k * 120)} style={styles.step}>
              <View style={[styles.check, isDone && { backgroundColor: colors.success, borderColor: colors.success }]}>
                {isDone && <Ionicons name="checkmark" size={14} color="#fff" />}
              </View>
              <T variant="callout" color={isDone ? colors.ink : colors.inkMute} style={{ fontFamily: 'Nunito_700Bold' }}>
                {s}
              </T>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas, alignItems: 'center', justifyContent: 'center' },
  inner: { width: 220, height: 220, borderRadius: 110, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  step: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  check: { width: 24, height: 24, borderRadius: radius.pill, borderWidth: 2, borderColor: colors.hairlineStrong, alignItems: 'center', justifyContent: 'center' },
});
