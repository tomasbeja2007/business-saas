import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { OnboardingShell } from '../../components/OnboardingShell';
import { Button, T } from '../../components/ui';
import { MascotArt } from '../../components/visuals';
import { useBuddy } from '../../lib/hooks';
import { haptic } from '../../lib/haptics';
import { useApp } from '../../store/useApp';
import { colors, radius, shadow, spacing } from '../../theme/tokens';

function PermissionCard({
  icon,
  title,
  body,
  granted,
  onAllow,
  accent,
  delay,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
  granted: boolean;
  onAllow: () => void;
  accent: string;
  delay: number;
}) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400)} style={styles.card}>
      <View style={[styles.icon, { backgroundColor: `${accent}1A` }]}>
        <Ionicons name={icon} size={22} color={accent} />
      </View>
      <View style={{ flex: 1 }}>
        <T variant="headline">{title}</T>
        <T variant="footnote" color={colors.inkMute} style={{ marginTop: 2 }}>
          {body}
        </T>
      </View>
      {granted ? (
        <Animated.View entering={ZoomIn} style={[styles.granted, { backgroundColor: colors.success }]}>
          <Ionicons name="checkmark" size={18} color="#fff" />
        </Animated.View>
      ) : (
        <Button title="Allow" size="sm" color={accent} onPress={onAllow} />
      )}
    </Animated.View>
  );
}

export default function Permissions() {
  const m = useBuddy();
  const settings = useApp((s) => s.settings);
  const update = useApp((s) => s.updateSettings);
  const allGranted = settings.screenTimeConnected && settings.notifications;

  return (
    <OnboardingShell
      progress={0.9}
      accent={m.accent}
      footer={
        <>
          <Button title={allGranted ? 'Continue' : 'Allow all & continue'} color={m.accent} onPress={() => {
            if (!allGranted) {
              update({ screenTimeConnected: true, notifications: true });
              haptic.success();
            }
            router.push('/onboarding/paywall');
          }} />
          {!allGranted && (
            <Button title="Not now" variant="ghost" size="md" color={colors.inkMute} onPress={() => router.push('/onboarding/paywall')} />
          )}
        </>
      }
    >
      <View style={{ alignItems: 'center', marginTop: spacing.md }}>
        <MascotArt mascot={m} size={150} />
      </View>
      <T variant="largeTitle" align="center" style={{ marginTop: spacing.md }}>
        Let {m.name} help
      </T>
      <T variant="body" color={colors.inkSoft} align="center" style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
        Two quick permissions so your buddy can track progress and nudge you at the right moments.
      </T>
      <View style={{ gap: spacing.sm }}>
        <PermissionCard
          icon="hourglass"
          title="Screen Time access"
          body="See your usage and set app limits."
          granted={settings.screenTimeConnected}
          onAllow={() => {
            haptic.success();
            update({ screenTimeConnected: true });
          }}
          accent={m.accent}
          delay={100}
        />
        <PermissionCard
          icon="notifications"
          title="Notifications"
          body={`Gentle nudges and cheers from ${m.name}.`}
          granted={settings.notifications}
          onAllow={() => {
            haptic.success();
            update({ notifications: true });
          }}
          accent={m.accent}
          delay={200}
        />
      </View>
      <View style={styles.privacy}>
        <Ionicons name="lock-closed" size={14} color={colors.inkMute} />
        <T variant="footnote" color={colors.inkMute}>
          Private by design. Your data never leaves your phone.
        </T>
      </View>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surface, padding: spacing.md, borderRadius: radius.xl, ...shadow.card },
  icon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  granted: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  privacy: { flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center', marginTop: spacing.xl },
});
