import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Pill, Squish, T } from '../../components/ui';
import { MascotArt, MascotAvatar } from '../../components/visuals';
import { MASCOTS, mascotList } from '../../data/mascots';
import { haptic } from '../../lib/haptics';
import { matchBuddy } from '../../lib/match';
import { useApp } from '../../store/useApp';
import { colors, radius, shadow, spacing } from '../../theme/tokens';

export default function Reveal() {
  const insets = useSafeAreaInsets();
  const answers = useApp((s) => s.answers);
  const mascotId = useApp((s) => s.mascotId);
  const matchPercent = useApp((s) => s.matchPercent);
  const setMascot = useApp((s) => s.setMascot);
  const name = useApp((s) => s.name);
  const [showAll, setShowAll] = useState(false);
  const m = MASCOTS[mascotId];
  const result = matchBuddy(answers);
  const isMatch = result.winner === mascotId;
  const reasons = isMatch && result.reasons.length ? result.reasons : m.traits.map((t) => `You’ll love a ${t.toLowerCase()} companion`);

  return (
    <View style={{ flex: 1, backgroundColor: colors.canvas }}>
      <LinearGradient colors={[m.gradient[0], colors.canvas]} style={StyleSheet.absoluteFill} end={{ x: 0.5, y: 0.65 }} />
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + spacing.xl, paddingHorizontal: spacing.xl, paddingBottom: spacing.xl }} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(400)} style={{ alignItems: 'center' }}>
          <Pill label={isMatch ? `${matchPercent}% match` : 'Your pick'} icon="heart" color={m.accentDeep} bg="#ffffffcc" style={{ alignSelf: 'center' }} />
          <T variant="headline" color={colors.inkSoft} style={{ marginTop: spacing.md }}>
            {name ? `${name}, meet your buddy` : 'Meet your buddy'}
          </T>
        </Animated.View>

        <Animated.View key={m.id} entering={ZoomIn.springify().damping(12)} style={{ alignItems: 'center', marginTop: spacing.sm }}>
          <MascotArt mascot={m} size={250} />
        </Animated.View>

        <Animated.View key={`${m.id}-t`} entering={FadeInDown.delay(250).duration(450)} style={{ alignItems: 'center' }}>
          <T variant="display" style={{ fontSize: 52, lineHeight: 58 }}>
            {m.name}
          </T>
          <View style={[styles.role, { backgroundColor: m.accentSoft }]}>
            <Ionicons name={m.icon} size={14} color={m.accentDeep} />
            <T variant="footnote" color={m.accentDeep} style={{ fontFamily: 'Nunito_800ExtraBold' }}>
              {m.role}
            </T>
          </View>
          <T variant="body" color={colors.inkSoft} align="center" style={{ marginTop: spacing.md }}>
            {m.description}
          </T>
        </Animated.View>

        <Animated.View key={`${m.id}-r`} entering={FadeInDown.delay(450).duration(450)} style={styles.card}>
          <T variant="overline" color={colors.inkMute}>
            Why {m.name} fits you
          </T>
          {reasons.map((r) => (
            <View key={r} style={styles.reason}>
              <View style={[styles.reasonIcon, { backgroundColor: m.accentSoft }]}>
                <Ionicons name="checkmark" size={14} color={m.accentDeep} />
              </View>
              <T variant="callout" style={{ flex: 1 }}>
                {r}
              </T>
            </View>
          ))}
          <View style={styles.traits}>
            <View style={styles.trait}>
              <T variant="caption" color={colors.inkMute}>
                Superpower
              </T>
              <T variant="subhead" style={{ fontFamily: 'Nunito_800ExtraBold' }}>
                {m.superpower}
              </T>
            </View>
            <View style={styles.trait}>
              <T variant="caption" color={colors.inkMute}>
                Personality
              </T>
              <T variant="subhead" style={{ fontFamily: 'Nunito_800ExtraBold' }}>
                {m.traits.slice(0, 2).join(' · ')}
              </T>
            </View>
          </View>
        </Animated.View>

        {showAll && (
          <Animated.View entering={FadeInDown.duration(300)} style={{ marginTop: spacing.lg }}>
            <T variant="headline" style={{ marginBottom: spacing.sm }}>
              Choose a different buddy
            </T>
            <View style={styles.pickRow}>
              {mascotList.map((x) => (
                <Squish
                  key={x.id}
                  onPress={() => {
                    haptic.select();
                    setMascot(x.id);
                  }}
                  hapticStyle="none"
                  style={[styles.pick, x.id === mascotId && { borderColor: x.accent }]}
                  accessibilityLabel={`Choose ${x.name}`}
                >
                  <MascotAvatar mascot={x} size={52} />
                  <T variant="caption" style={{ marginTop: 4 }}>
                    {x.name}
                  </T>
                </Squish>
              ))}
            </View>
          </Animated.View>
        )}
      </ScrollView>
      <View style={{ paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: Math.max(insets.bottom, spacing.lg), gap: spacing.xs, backgroundColor: colors.canvas }}>
        <Button title={`Continue with ${m.name}`} color={m.accent} onPress={() => router.push('/onboarding/goal')} />
        {!showAll && <Button title="See other buddies" variant="ghost" color={colors.inkSoft} size="md" onPress={() => setShowAll(true)} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  role: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill, marginTop: spacing.xs },
  card: { marginTop: spacing.xl, backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.lg, gap: spacing.sm, ...shadow.card },
  reason: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  reasonIcon: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  traits: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
  trait: { flex: 1, backgroundColor: colors.canvas, borderRadius: radius.md, padding: spacing.sm, gap: 2 },
  pickRow: { flexDirection: 'row', justifyContent: 'space-between' },
  pick: { alignItems: 'center', padding: 6, borderRadius: radius.lg, borderWidth: 2, borderColor: 'transparent', backgroundColor: colors.surface, width: '18.5%' },
});
