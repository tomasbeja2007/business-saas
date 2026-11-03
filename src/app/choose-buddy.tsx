import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ModalHeader } from '../components/ModalHeader';
import { Squish, T } from '../components/ui';
import { MascotArt } from '../components/visuals';
import { mascotList } from '../data/mascots';
import { haptic } from '../lib/haptics';
import { useApp } from '../store/useApp';
import { colors, radius, shadow, spacing } from '../theme/tokens';

export default function ChooseBuddy() {
  const insets = useSafeAreaInsets();
  const current = useApp((s) => s.mascotId);
  const setMascot = useApp((s) => s.setMascot);

  return (
    <View style={{ flex: 1, backgroundColor: colors.canvas }}>
      <ModalHeader title="Choose your buddy" />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: insets.bottom + spacing.xl, gap: spacing.sm }}>
        {mascotList.map((m) => {
          const on = m.id === current;
          return (
            <Squish
              key={m.id}
              hapticStyle="none"
              onPress={() => {
                haptic.success();
                setMascot(m.id);
                setTimeout(() => router.back(), 250);
              }}
              style={[styles.card, on && { borderColor: m.accent }]}
              accessibilityState={{ selected: on }}
            >
              <LinearGradient colors={m.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
              <MascotArt mascot={m} size={104} float={false} shadow={false} />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View style={[styles.icon, { backgroundColor: m.accentSoft }]}>
                    <Ionicons name={m.icon} size={13} color={m.accentDeep} />
                  </View>
                  <T variant="title2">{m.name}</T>
                </View>
                <T variant="footnote" color={colors.inkSoft} style={{ marginTop: 4 }}>
                  {m.tagline}
                </T>
              </View>
              {on && (
                <View style={[styles.check, { backgroundColor: m.accent }]}>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                </View>
              )}
            </Squish>
          );
        })}
        <T variant="footnote" color={colors.inkMute} align="center" style={{ marginTop: spacing.sm }}>
          Your XP, streak and progress stay with you.
        </T>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    paddingRight: spacing.md,
    borderRadius: radius.xl,
    borderWidth: 2.5,
    borderColor: 'transparent',
    overflow: 'hidden',
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  icon: { width: 24, height: 24, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  check: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});
