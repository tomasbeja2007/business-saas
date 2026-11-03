import { ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ModalHeader } from '../components/ModalHeader';
import { Card, Squish, T } from '../components/ui';
import { AppIcon } from '../components/visuals';
import { APPS, APP_ORDER } from '../data/apps';
import { haptic } from '../lib/haptics';
import { useBuddy, useUsage } from '../lib/hooks';
import { formatMinutes } from '../lib/usage';
import { useApp } from '../store/useApp';
import { colors, radius, spacing } from '../theme/tokens';

const LIMIT_OPTIONS: (number | null)[] = [null, 15, 30, 45, 60, 90, 120];

export default function Limits() {
  const insets = useSafeAreaInsets();
  const m = useBuddy();
  const limits = useApp((s) => s.limits);
  const setLimit = useApp((s) => s.setLimit);
  const blocked = useApp((s) => s.blockedApps);
  const toggleBlocked = useApp((s) => s.toggleBlockedApp);
  const { today } = useUsage();
  const usageFor = (id: string) => today.apps.find((a) => a.app.id === id)?.minutes ?? 0;

  const cycle = (id: string) => {
    const cur = limits[id] ?? null;
    const idx = LIMIT_OPTIONS.indexOf(cur);
    setLimit(id, LIMIT_OPTIONS[(idx + 1) % LIMIT_OPTIONS.length]);
  };

  const sorted = [...APP_ORDER].sort((a, b) => usageFor(b) - usageFor(a));

  return (
    <View style={{ flex: 1, backgroundColor: colors.canvas }}>
      <ModalHeader title="Apps & limits" accent={m.accentDeep} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: insets.bottom + spacing.xl }}>
        <T variant="body" color={colors.inkSoft} style={{ marginBottom: spacing.md }}>
          Tap the limit to cycle through daily allowances. Switch on apps to block them during focus sessions.
        </T>
        <Card padded={false}>
          {sorted.map((id, i) => {
            const app = APPS[id];
            const limit = limits[id];
            const used = usageFor(id);
            const over = limit != null && used > limit;
            return (
              <View key={id} style={[styles.row, i > 0 && styles.divider]}>
                <AppIcon app={app} size={40} />
                <View style={{ flex: 1 }}>
                  <T variant="callout" style={{ fontFamily: 'Nunito_700Bold' }}>
                    {app.name}
                  </T>
                  <T variant="footnote" color={over ? colors.danger : colors.inkMute}>
                    {formatMinutes(used, true)} today
                  </T>
                </View>
                <Squish
                  onPress={() => cycle(id)}
                  hapticStyle="select"
                  style={[styles.limit, limit != null && { backgroundColor: m.accentSoft }]}
                  accessibilityLabel={`${app.name} daily limit: ${limit != null ? formatMinutes(limit) : 'none'}`}
                >
                  <T variant="footnote" color={limit != null ? m.accentDeep : colors.inkMute} style={{ fontFamily: 'Nunito_800ExtraBold' }}>
                    {limit != null ? formatMinutes(limit, true) : 'No limit'}
                  </T>
                </Squish>
                <Switch
                  value={blocked.includes(id)}
                  onValueChange={() => {
                    haptic.select();
                    toggleBlocked(id);
                  }}
                  trackColor={{ true: m.accent, false: '#E3E1EA' }}
                  thumbColor="#fff"
          {...({ activeThumbColor: "#fff" } as object)}
                  ios_backgroundColor="#E3E1EA"
                  accessibilityLabel={`Block ${app.name} during focus`}
                />
              </View>
            );
          })}
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.md, paddingVertical: 12 },
  divider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.hairlineStrong },
  limit: { minWidth: 72, height: 32, paddingHorizontal: 10, borderRadius: radius.pill, backgroundColor: colors.canvas, alignItems: 'center', justifyContent: 'center' },
});
