import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { OnboardingShell } from '../../components/OnboardingShell';
import { Button, Squish, T } from '../../components/ui';
import { MascotAvatar } from '../../components/visuals';
import { useBuddy } from '../../lib/hooks';
import { estimateHours, suggestedGoalMinutes } from '../../lib/match';
import { formatMinutes } from '../../lib/usage';
import { useApp } from '../../store/useApp';
import { colors, radius, shadow, spacing } from '../../theme/tokens';

const PRESETS = [60, 90, 120, 180, 240];

export default function Goal() {
  const m = useBuddy();
  const answers = useApp((s) => s.answers);
  const setDailyGoal = useApp((s) => s.setDailyGoal);
  const current = estimateHours(answers) * 60;
  const [goal, setGoal] = useState(() => suggestedGoalMinutes(estimateHours(answers)));
  const saved = Math.max(0, current - goal);

  const step = (d: number) => setGoal((g) => Math.min(600, Math.max(30, g + d)));

  return (
    <OnboardingShell
      progress={0.78}
      accent={m.accent}
      footer={
        <Button
          title="Set my goal"
          color={m.accent}
          onPress={() => {
            setDailyGoal(goal);
            router.push('/onboarding/permissions');
          }}
        />
      }
    >
      <View style={styles.speech}>
        <MascotAvatar mascot={m} size={52} />
        <View style={styles.bubble}>
          <T variant="callout" style={{ fontFamily: 'Nunito_700Bold' }}>
            Let’s set a daily goal we can hit together. I’ll cheer you on!
          </T>
        </View>
      </View>
      <T variant="largeTitle" style={{ marginTop: spacing.xl }}>
        Your daily screen time goal
      </T>

      <View style={styles.dial}>
        <Squish onPress={() => step(-15)} style={styles.stepBtn} accessibilityLabel="Decrease goal by 15 minutes" hapticStyle="select">
          <Ionicons name="remove" size={26} color={colors.ink} />
        </Squish>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <T style={styles.goalText}>{formatMinutes(goal, true)}</T>
          <T variant="footnote" color={colors.inkMute}>
            per day
          </T>
        </View>
        <Squish onPress={() => step(15)} style={styles.stepBtn} accessibilityLabel="Increase goal by 15 minutes" hapticStyle="select">
          <Ionicons name="add" size={26} color={colors.ink} />
        </Squish>
      </View>

      <View style={styles.presets}>
        {PRESETS.map((p) => (
          <Squish
            key={p}
            onPress={() => setGoal(p)}
            hapticStyle="select"
            style={[styles.preset, goal === p && { backgroundColor: m.accent }]}
          >
            <T variant="subhead" color={goal === p ? '#fff' : colors.inkSoft} style={{ fontFamily: 'Nunito_800ExtraBold' }}>
              {formatMinutes(p, true)}
            </T>
          </Squish>
        ))}
      </View>

      <View style={[styles.impact, { backgroundColor: m.accentSoft }]}>
        <Ionicons name="time" size={22} color={m.accentDeep} />
        <View style={{ flex: 1 }}>
          <T variant="headline" color={m.accentDeep}>
            {saved > 0 ? `+${formatMinutes(saved)} back every day` : 'A great place to start'}
          </T>
          <T variant="footnote" color={colors.inkSoft}>
            {saved > 0
              ? `That’s ${Math.round((saved * 365) / 60 / 24)} full days a year for the things you love.`
              : 'You can adjust your goal anytime in settings.'}
          </T>
        </View>
      </View>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  speech: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, marginTop: spacing.md },
  bubble: { flex: 1, backgroundColor: colors.surface, padding: spacing.md, borderRadius: radius.lg, borderBottomLeftRadius: 6, ...shadow.card },
  dial: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    ...shadow.card,
  },
  stepBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.canvas, alignItems: 'center', justifyContent: 'center' },
  goalText: { fontFamily: 'Nunito_900Black', fontSize: 48, lineHeight: 56, letterSpacing: -1.5, color: colors.ink, fontVariant: ['tabular-nums'] },
  presets: { flexDirection: 'row', gap: spacing.xs, marginTop: spacing.md },
  preset: { flex: 1, height: 40, borderRadius: radius.pill, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  impact: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center', marginTop: spacing.xl, padding: spacing.lg, borderRadius: radius.xl },
});
