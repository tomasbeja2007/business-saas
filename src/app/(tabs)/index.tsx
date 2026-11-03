import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { TabScreen } from '../../components/TabScreen';
import { Card, IconButton, ProgressBar, SectionHeader, Squish, T } from '../../components/ui';
import { AppIcon, MascotArt } from '../../components/visuals';
import { greeting, useBuddy, useUsage } from '../../lib/hooks';
import { moodFor } from '../../lib/mood';
import { dayKey, formatMinutes } from '../../lib/usage';
import { activeDayStreak, useApp } from '../../store/useApp';
import { colors, radius, shadow, spacing } from '../../theme/tokens';

export default function Today() {
  const m = useBuddy();
  const name = useApp((s) => s.name);
  const goal = useApp((s) => s.dailyGoal);
  const sessions = useApp((s) => s.focusSessions);
  const challengesDone = useApp((s) => s.challengesDone);
  const toggleChallenge = useApp((s) => s.toggleChallenge);
  const limits = useApp((s) => s.limits);
  const { today, focusToday } = useUsage();
  const mood = moodFor(today.total, goal);
  const left = goal - today.total;
  const streak = activeDayStreak(sessions, challengesDone);
  const doneToday = challengesDone[dayKey(new Date())] ?? [];
  const date = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <TabScreen
      subtitle={date}
      title={`${greeting()}${name ? `, ${name}` : ''}`}
      right={<IconButton icon="settings-outline" label="Settings" onPress={() => router.push('/settings')} />}
    >
      {/* Hero */}
      <Animated.View entering={FadeInDown.duration(450)} style={[styles.hero, shadow.raised]}>
        <LinearGradient colors={m.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, paddingTop: spacing.xs }}>
            <T variant="overline" color={m.accentDeep}>
              Screen time today
            </T>
            <T style={styles.heroStat}>{formatMinutes(today.total, true)}</T>
            <T variant="subhead" color={colors.inkSoft}>
              {left >= 0 ? `${formatMinutes(left)} left of ${formatMinutes(goal, true)}` : `${formatMinutes(-left)} over your ${formatMinutes(goal, true)} goal`}
            </T>
            <View style={[styles.moodPill, { backgroundColor: '#ffffffb3' }]}>
              <T style={{ fontSize: 14 }}>{mood.emoji}</T>
              <T variant="caption" color={mood.color} style={{ fontFamily: 'Nunito_800ExtraBold' }}>
                {m.name} is {mood.label.toLowerCase()}
              </T>
            </View>
          </View>
          <MascotArt mascot={m} size={138} style={{ marginRight: -spacing.sm, marginTop: -spacing.xs }} />
        </View>
        <View style={{ marginTop: spacing.md }}>
          <ProgressBar progress={today.total / goal} color={left >= 0 ? m.accent : colors.danger} track="#ffffff99" height={10} />
        </View>
        <View style={styles.speech}>
          <Ionicons name="chatbubble-ellipses" size={16} color={m.accentDeep} />
          <T variant="footnote" color={colors.ink} style={{ flex: 1, fontFamily: 'Nunito_700Bold' }}>
            {mood.label === 'Worn out' || mood.label === 'Careful' ? m.nudges[0] : m.greetings[new Date().getDate() % m.greetings.length]}
          </T>
        </View>
      </Animated.View>

      {/* Stats */}
      <Animated.View entering={FadeInDown.delay(80).duration(450)} style={styles.stats}>
        {[
          { icon: 'flame' as const, color: '#F07B3A', value: `${streak}`, label: streak === 1 ? 'day streak' : 'day streak' },
          { icon: 'phone-portrait' as const, color: m.accent, value: `${today.pickups}`, label: 'pickups' },
          { icon: 'timer' as const, color: colors.success, value: formatMinutes(focusToday, true), label: 'focused' },
        ].map((s) => (
          <Card key={s.label} style={styles.stat} padded={false}>
            <Ionicons name={s.icon} size={20} color={s.color} />
            <T variant="statSm" style={{ marginTop: 6 }}>
              {s.value}
            </T>
            <T variant="caption" color={colors.inkMute}>
              {s.label}
            </T>
          </Card>
        ))}
      </Animated.View>

      {/* Focus CTA */}
      <Animated.View entering={FadeInDown.delay(140).duration(450)}>
        <Squish onPress={() => router.push('/(tabs)/focus')} style={[styles.cta, { backgroundColor: colors.ink }]} hapticStyle="medium">
          <View style={[styles.ctaIcon, { backgroundColor: m.accent }]}>
            <Ionicons name="play" size={22} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <T variant="headline" color="#fff">
              Start a focus session
            </T>
            <T variant="footnote" color="rgba(255,255,255,0.65)">
              Block distractions with {m.name}
            </T>
          </View>
          <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.6)" />
        </Squish>
      </Animated.View>

      {/* Challenges */}
      <SectionHeader title="Today’s challenges" action={`${doneToday.length}/${m.challenges.length} done`} />
      <Card padded={false}>
        {m.challenges.map((c, i) => {
          const done = doneToday.includes(c.id);
          return (
            <Squish
              key={c.id}
              onPress={() => toggleChallenge(c.id, c.xp)}
              hapticStyle={done ? 'tap' : 'success'}
              scaleTo={0.985}
              style={[styles.challenge, i < m.challenges.length - 1 && styles.divider]}
              accessibilityState={{ checked: done }}
              accessibilityRole="checkbox"
            >
              <View style={[styles.chIcon, { backgroundColor: done ? colors.successSoft : m.accentSoft }]}>
                <Ionicons name={c.icon} size={20} color={done ? colors.success : m.accentDeep} />
              </View>
              <View style={{ flex: 1 }}>
                <T variant="headline" color={done ? colors.inkMute : colors.ink} style={done && { textDecorationLine: 'line-through' }}>
                  {c.title}
                </T>
                <T variant="footnote" color={colors.inkMute}>
                  {c.detail}
                </T>
              </View>
              {done ? (
                <Animated.View entering={ZoomIn} style={[styles.check, { backgroundColor: colors.success }]}>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                </Animated.View>
              ) : (
                <View style={styles.xp}>
                  <T variant="caption" color={m.accentDeep} style={{ fontFamily: 'Nunito_800ExtraBold' }}>
                    +{c.xp} XP
                  </T>
                </View>
              )}
            </Squish>
          );
        })}
      </Card>

      {/* Apps */}
      <SectionHeader title="Most used today" action="Limits" onAction={() => router.push('/limits')} />
      <Card>
        {today.apps.slice(0, 5).map((a, i) => {
          const limit = limits[a.app.id];
          const over = limit != null && a.minutes > limit;
          return (
            <View key={a.app.id} style={[styles.appRow, i > 0 && { marginTop: spacing.md }]}>
              <AppIcon app={a.app} size={38} />
              <View style={{ flex: 1, gap: 6 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <T variant="callout" style={{ fontFamily: 'Nunito_700Bold' }}>
                    {a.app.name}
                  </T>
                  <T variant="subhead" color={over ? colors.danger : colors.inkSoft} style={{ fontVariant: ['tabular-nums'] }}>
                    {formatMinutes(a.minutes, true)}
                    {limit != null ? ` / ${formatMinutes(limit, true)}` : ''}
                  </T>
                </View>
                <ProgressBar progress={a.minutes / (limit ?? today.apps[0].minutes)} color={over ? colors.danger : m.accent} height={6} />
              </View>
            </View>
          );
        })}
      </Card>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: radius.xl, padding: spacing.lg, overflow: 'hidden', backgroundColor: colors.surface },
  heroStat: { fontFamily: 'Nunito_900Black', fontSize: 44, lineHeight: 52, letterSpacing: -1.4, color: colors.ink, fontVariant: ['tabular-nums'], marginTop: 2 },
  moodPill: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill, marginTop: spacing.sm },
  speech: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: spacing.md, backgroundColor: '#ffffffb3', padding: spacing.sm, borderRadius: radius.md },
  stats: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  stat: { flex: 1, padding: spacing.md, borderRadius: radius.lg },
  cta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, borderRadius: radius.xl, marginTop: spacing.md, ...shadow.raised },
  ctaIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  challenge: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md },
  divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.hairlineStrong },
  chIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  check: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  xp: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.pill, backgroundColor: colors.canvas },
  appRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
