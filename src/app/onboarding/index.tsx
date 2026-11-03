import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, T } from '../../components/ui';
import { MascotArt } from '../../components/visuals';
import { MASCOTS } from '../../data/mascots';
import { colors, spacing } from '../../theme/tokens';

const CLUSTER = [
  { id: 'sage', cx: 0.2, y: 0.0, s: 0.34, d: 200 },
  { id: 'volt', cx: 0.8, y: 0.0, s: 0.32, d: 300 },
  { id: 'oak', cx: 0.19, y: 0.5, s: 0.3, d: 400 },
  { id: 'momo', cx: 0.79, y: 0.53, s: 0.36, d: 500 },
  { id: 'byte', cx: 0.5, y: 0.2, s: 0.46, d: 100 },
] as const;

export default function Welcome() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const w = Math.min(width, 440);
  const stage = w * 0.95;

  return (
    <View style={{ flex: 1, backgroundColor: colors.canvas }}>
      <LinearGradient colors={['#ECE8FA', '#F7F4EF']} style={StyleSheet.absoluteFill} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 0.7 }} />
      <View style={{ paddingTop: insets.top + spacing.md, alignItems: 'center' }}>
        <Animated.View entering={FadeInDown.duration(500)} style={styles.brand}>
          <View style={styles.brandDot} />
          <T variant="title3" style={{ letterSpacing: -0.2 }}>
            lumi
          </T>
        </Animated.View>
      </View>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: stage, height: stage * 0.9 }}>
          {CLUSTER.map((c) => {
            const size = stage * c.s;
            return (
              <Animated.View
                key={c.id}
                entering={FadeInUp.delay(c.d).springify().damping(14)}
                style={{ position: 'absolute', left: c.cx * stage - size / 2, top: c.y * stage, zIndex: c.id === 'byte' ? 2 : 1 }}
              >
                <MascotArt mascot={MASCOTS[c.id]} size={size} shadow={false} />
              </Animated.View>
            );
          })}
        </View>
      </View>

      <Animated.View entering={FadeInDown.delay(500).duration(600)} style={{ paddingHorizontal: spacing.xl }}>
        <T variant="display" align="center">
          Less scrolling.{'\n'}More living.
        </T>
        <T variant="body" color={colors.inkSoft} align="center" style={{ marginTop: spacing.sm, paddingHorizontal: spacing.md }}>
          Answer a few quick questions and we’ll pair you with a buddy who helps you take back your time.
        </T>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(700).duration(600)}
        style={{ paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: Math.max(insets.bottom, spacing.lg) }}
      >
        <Button title="Find my buddy" iconRight="arrow-forward" onPress={() => router.push('/onboarding/name')} />
        <View style={styles.meta}>
          <T variant="footnote" color={colors.inkMute}>
            ⏱ 2 minutes
          </T>
          <View style={styles.sep} />
          <T variant="footnote" color={colors.inkMute}>
            🔒 Your data stays on your phone
          </T>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  brand: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  brandDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: colors.primary },
  meta: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: spacing.md },
  sep: { width: 3, height: 3, borderRadius: 2, backgroundColor: colors.inkFaint },
});
