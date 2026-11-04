import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { TabScreen } from '../../components/TabScreen';
import { Button, Card, SectionHeader, Squish, T } from '../../components/ui';
import { AppIcon, MascotArt } from '../../components/visuals';
import { APPS } from '../../data/apps';
import { useBuddy, useUsage } from '../../lib/hooks';
import { formatMinutes } from '../../lib/usage';
import { useApp } from '../../store/useApp';
import { colors, radius, shadow, spacing } from '../../theme/tokens';

const DURATIONS = [15, 25, 45, 60, 90];
const MODES: { id: string; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'deep', label: 'Deep work', icon: 'laptop-outline' },
  { id: 'study', label: 'Study', icon: 'school-outline' },
  { id: 'read', label: 'Reading', icon: 'book-outline' },
  { id: 'move', label: 'Workout', icon: 'barbell-outline' },
  { id: 'rest', label: 'Wind down', icon: 'moon-outline' },
  { id: 'people', label: 'Be present', icon: 'people-outline' },
];

export default function Focus() {
  const m = useBuddy();
  const blocked = useApp((s) => s.blockedApps);
  const sessions = useApp((s) => s.focusSessions);
  const { focusWeek } = useUsage();
  const [minutes, setMinutes] = useState(25);
  const [mode, setMode] = useState(MODES[0]);

  return (
    <TabScreen title="Focus" subtitle="Block distractions">
      <Animated.View entering={FadeInDown.duration(400)}>
        <Card style={{ alignItems: 'center', paddingTop: spacing.md }}>
          <View style={[styles.stage, { backgroundColor: m.accentSoft }]}>
            <MascotArt mascot={m} size={150} ambient interactive />
          </View>
          <T style={styles.time}>{minutes}</T>
          <T variant="subhead" color={colors.inkMute} style={{ marginTop: -4 }}>
            minutes of {mode.label.toLowerCase()}
          </T>
          <View style={styles.durations}>
            {DURATIONS.map((d) => {
              const on = d === minutes;
              return (
                <Squish key={d} onPress={() => setMinutes(d)} hapticStyle="select" style={[styles.dur, on && { backgroundColor: m.accent }]} accessibilityLabel={`${d} minutes`}>
                  <T variant="subhead" color={on ? '#fff' : colors.inkSoft} style={{ fontFamily: 'Nunito_800ExtraBold' }}>
                    {d}m
                  </T>
                </Squish>
              );
            })}
          </View>
          <Button
            title="Start focus"
            icon="play"
            color={m.accent}
            style={{ alignSelf: 'stretch', marginTop: spacing.lg }}
            onPress={() => router.push({ pathname: '/focus-session', params: { minutes: String(minutes), label: mode.label } })}
          />
        </Card>
      </Animated.View>

      <SectionHeader title="What are you focusing on?" />
      <View style={styles.modes}>
        {MODES.map((x) => {
          const on = x.id === mode.id;
          return (
            <Squish key={x.id} onPress={() => setMode(x)} hapticStyle="select" style={[styles.mode, on && { borderColor: m.accent, backgroundColor: m.accentSoft }]}>
              <Ionicons name={x.icon} size={20} color={on ? m.accentDeep : colors.inkSoft} />
              <T variant="footnote" color={on ? m.accentDeep : colors.ink} style={{ fontFamily: 'Nunito_700Bold' }}>
                {x.label}
              </T>
            </Squish>
          );
        })}
      </View>

      <SectionHeader title="Blocked during focus" action="Edit" onAction={() => router.push('/limits')} />
      <Card>
        {blocked.length ? (
          <View style={styles.blocked}>
            {blocked.map((id) =>
              APPS[id] ? (
                <View key={id} style={{ alignItems: 'center', width: 60 }}>
                  <View>
                    <AppIcon app={APPS[id]} size={46} />
                    <View style={styles.lock}>
                      <Ionicons name="lock-closed" size={10} color="#fff" />
                    </View>
                  </View>
                  <T variant="caption" color={colors.inkSoft} numberOfLines={1} style={{ marginTop: 4 }}>
                    {APPS[id].name}
                  </T>
                </View>
              ) : null,
            )}
          </View>
        ) : (
          <Squish onPress={() => router.push('/limits')} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <Ionicons name="add-circle" size={24} color={m.accent} />
            <T variant="callout" style={{ fontFamily: 'Nunito_700Bold' }}>
              Choose apps to block
            </T>
          </Squish>
        )}
      </Card>

      <SectionHeader title="Recent sessions" action={`${formatMinutes(focusWeek, true)} this week`} />
      <Card padded={false}>
        {sessions.length === 0 ? (
          <View style={{ padding: spacing.lg, alignItems: 'center' }}>
            <T variant="callout" color={colors.inkMute} align="center">
              Your completed sessions will show up here.{'\n'}Each one earns XP for {m.name}.
            </T>
          </View>
        ) : (
          sessions.slice(0, 6).map((s, i) => (
            <View key={s.id} style={[styles.session, i > 0 && styles.divider]}>
              <View style={[styles.sIcon, { backgroundColor: s.completed ? colors.successSoft : colors.warningSoft }]}>
                <Ionicons name={s.completed ? 'checkmark' : 'pause'} size={16} color={s.completed ? colors.success : colors.warning} />
              </View>
              <View style={{ flex: 1 }}>
                <T variant="callout" style={{ fontFamily: 'Nunito_700Bold' }}>
                  {s.label}
                </T>
                <T variant="footnote" color={colors.inkMute}>
                  {new Date(s.startedAt).toLocaleString(undefined, { weekday: 'short', hour: 'numeric', minute: '2-digit' })}
                </T>
              </View>
              <T variant="subhead" color={colors.inkSoft}>
                {formatMinutes(s.minutes, true)}
              </T>
            </View>
          ))
        )}
      </Card>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  stage: { width: 190, height: 190, borderRadius: 95, alignItems: 'center', justifyContent: 'center' },
  time: { fontFamily: 'Nunito_900Black', fontSize: 64, lineHeight: 72, letterSpacing: -2, color: colors.ink, marginTop: spacing.sm, fontVariant: ['tabular-nums'] },
  durations: { flexDirection: 'row', gap: spacing.xs, marginTop: spacing.md },
  dur: { width: 54, height: 40, borderRadius: radius.pill, backgroundColor: colors.canvas, alignItems: 'center', justifyContent: 'center' },
  modes: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  mode: {
    width: '31.8%',
    alignItems: 'center',
    gap: 6,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadow.card,
  },
  blocked: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  lock: { position: 'absolute', right: -4, bottom: -4, width: 20, height: 20, borderRadius: 10, backgroundColor: colors.ink, borderWidth: 2, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  session: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md },
  divider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.hairlineStrong },
  sIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
});
