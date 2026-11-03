import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, IconButton, Squish, T } from '../../components/ui';
import { MascotArt } from '../../components/visuals';
import { FREE_EARLY_ACCESS, PLANS } from '../../data/plans';
import { haptic } from '../../lib/haptics';
import { useBuddy } from '../../lib/hooks';
import { useApp, type Plan } from '../../store/useApp';
import { colors, radius, shadow, spacing } from '../../theme/tokens';

const FEATURES: { icon: keyof typeof Ionicons.glyphMap; title: string }[] = [
  { icon: 'shield-checkmark', title: 'Block distracting apps & set limits' },
  { icon: 'timer', title: 'Unlimited focus sessions' },
  { icon: 'analytics', title: 'Weekly insights & trends' },
  { icon: 'trophy', title: 'Daily challenges, streaks & rewards' },
  { icon: 'happy', title: 'Your buddy levels up with you' },
];

export default function Paywall() {
  const insets = useSafeAreaInsets();
  const m = useBuddy();
  const setPlan = useApp((s) => s.setPlan);
  const complete = useApp((s) => s.completeOnboarding);
  const [plan, setLocal] = useState<Plan>('yearly');

  const start = (p: Plan) => {
    setPlan(p);
    complete();
    haptic.success();
    router.replace('/(tabs)');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.canvas }}>
      <LinearGradient colors={[m.gradient[0], colors.canvas]} style={StyleSheet.absoluteFill} end={{ x: 0.5, y: 0.5 }} />
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + spacing.xs, paddingBottom: spacing.lg }} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <IconButton icon="close" label="Close" bg="#ffffff99" color={colors.inkSoft} size={34} onPress={() => start(plan)} />
        </View>
        <View style={{ alignItems: 'center', marginTop: -spacing.md }}>
          <MascotArt mascot={m} size={150} />
        </View>
        <View style={{ paddingHorizontal: spacing.xl }}>
          <T variant="largeTitle" align="center">
            Unlock Lumi Plus
          </T>
          {FREE_EARLY_ACCESS && (
            <View style={[styles.early, { backgroundColor: m.accent }]}>
              <Ionicons name="gift" size={14} color="#fff" />
              <T variant="caption" color="#fff" style={{ fontFamily: 'Nunito_800ExtraBold' }}>
                EARLY ACCESS · EVERYTHING FREE FOR NOW
              </T>
            </View>
          )}

          <View style={styles.features}>
            {FEATURES.map((f, i) => (
              <Animated.View key={f.title} entering={FadeInDown.delay(80 * i).duration(350)} style={styles.feature}>
                <View style={[styles.featureIcon, { backgroundColor: m.accentSoft }]}>
                  <Ionicons name={f.icon} size={16} color={m.accentDeep} />
                </View>
                <T variant="callout" style={{ flex: 1, fontFamily: 'Nunito_700Bold' }}>
                  {f.title}
                </T>
              </Animated.View>
            ))}
          </View>

          <View style={{ gap: spacing.sm, marginTop: spacing.lg }}>
            {PLANS.map((p) => {
              const on = plan === p.id;
              return (
                <Squish
                  key={p.id}
                  onPress={() => setLocal(p.id)}
                  hapticStyle="select"
                  style={[styles.plan, on && { borderColor: m.accent, backgroundColor: '#fff' }]}
                  accessibilityState={{ selected: on }}
                  accessibilityLabel={`${p.title} plan, free during early access`}
                >
                  <View style={[styles.radio, on && { borderColor: m.accent, backgroundColor: m.accent }]}>
                    {on && <Ionicons name="checkmark" size={14} color="#fff" />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <T variant="headline">{p.title}</T>
                    <T variant="footnote" color={colors.inkMute}>
                      {p.note}
                    </T>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    {FREE_EARLY_ACCESS ? (
                      <>
                        <T variant="headline" color={m.accentDeep}>
                          Free
                        </T>
                        <T variant="caption" color={colors.inkFaint} style={{ textDecorationLine: 'line-through' }}>
                          {p.price}
                          {p.period === 'once' ? '' : p.period}
                        </T>
                      </>
                    ) : (
                      <T variant="headline">
                        {p.price}
                        <T variant="footnote" color={colors.inkMute}>
                          {p.period === 'once' ? ' once' : p.period}
                        </T>
                      </T>
                    )}
                  </View>
                  {p.badge && (
                    <View style={[styles.badge, { backgroundColor: m.accent }]}>
                      <T variant="caption" color="#fff" style={{ fontSize: 10, letterSpacing: 0.5, fontFamily: 'Nunito_900Black' }}>
                        {p.badge.toUpperCase()}
                      </T>
                    </View>
                  )}
                </Squish>
              );
            })}
          </View>
        </View>
      </ScrollView>
      <View style={{ paddingHorizontal: spacing.xl, paddingBottom: Math.max(insets.bottom, spacing.md), paddingTop: spacing.sm }}>
        <Button
          title={FREE_EARLY_ACCESS ? `Start ${PLANS.find((p) => p.id === plan)?.title} — Free` : 'Continue'}
          color={m.accent}
          onPress={() => start(plan)}
        />
        <View style={styles.legal}>
          <T variant="caption" color={colors.inkMute}>
            No payment required
          </T>
          <View style={styles.dot} />
          <T variant="caption" color={colors.inkMute}>
            Terms
          </T>
          <View style={styles.dot} />
          <T variant="caption" color={colors.inkMute}>
            Privacy
          </T>
          <View style={styles.dot} />
          <T variant="caption" color={colors.inkMute}>
            Restore
          </T>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: spacing.md, zIndex: 2 },
  early: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill, marginTop: spacing.sm },
  features: { marginTop: spacing.lg, gap: 10 },
  feature: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  featureIcon: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  plan: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    minHeight: 72,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.hairlineStrong, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: -10, right: 16, paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill },
  legal: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: spacing.sm },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: colors.inkFaint },
});
