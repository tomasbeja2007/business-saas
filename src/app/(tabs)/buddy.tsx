import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOutUp, ZoomIn, useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Card, ProgressBar, SectionHeader, T } from '../../components/ui';
import { MascotArt } from '../../components/visuals';
import { haptic } from '../../lib/haptics';
import { useBuddy, useUsage } from '../../lib/hooks';
import { moodFor } from '../../lib/mood';
import { formatMinutes } from '../../lib/usage';
import { activeDayStreak, levelFromXp, useApp } from '../../store/useApp';
import { colors, radius, shadow, spacing } from '../../theme/tokens';

type Badge = { id: string; icon: keyof typeof Ionicons.glyphMap; title: string; desc: string; unlocked: boolean };

export default function Buddy() {
  const insets = useSafeAreaInsets();
  const m = useBuddy();
  const xp = useApp((s) => s.xp);
  const goal = useApp((s) => s.dailyGoal);
  const sessions = useApp((s) => s.focusSessions);
  const challenges = useApp((s) => s.challengesDone);
  const joinedAt = useApp((s) => s.joinedAt);
  const addXp = useApp((s) => s.addXp);
  const { today } = useUsage();
  const lvl = levelFromXp(xp);
  const mood = moodFor(today.total, goal);
  const streak = activeDayStreak(sessions, challenges);
  const days = Math.max(1, Math.ceil((Date.now() - joinedAt) / 86400000));
  const focusTotal = sessions.reduce((a, s) => a + s.minutes, 0);
  const challengeTotal = Object.values(challenges).reduce((a, v) => a + v.length, 0);

  const [line, setLine] = useState(m.greetings[0]);
  const [pets, setPets] = useState<number[]>([]);
  const bounce = useSharedValue(1);
  const bounceStyle = useAnimatedStyle(() => ({ transform: [{ scale: bounce.value }] }));

  const pet = () => {
    haptic.medium();
    bounce.value = withSequence(withSpring(1.08, { damping: 6, stiffness: 400 }), withSpring(1, { damping: 8 }));
    const all = [...m.greetings, ...m.cheers];
    setLine(all[Math.floor(Math.random() * all.length)]);
    const id = Date.now();
    setPets((p) => [...p.slice(-4), id]);
    setTimeout(() => setPets((p) => p.filter((x) => x !== id)), 900);
    if (Math.random() < 0.25) addXp(1);
  };

  const badges: Badge[] = [
    { id: 'first', icon: 'sparkles', title: 'First steps', desc: 'Met your buddy', unlocked: true },
    { id: 'focus1', icon: 'timer', title: 'In the zone', desc: 'Finish a focus session', unlocked: sessions.some((s) => s.completed) },
    { id: 'chal', icon: 'checkmark-done', title: 'Challenger', desc: 'Complete 5 challenges', unlocked: challengeTotal >= 5 },
    { id: 'streak3', icon: 'flame', title: 'On fire', desc: '3 day streak', unlocked: streak >= 3 },
    { id: 'hour', icon: 'hourglass', title: 'Hour hero', desc: '60 min focused total', unlocked: focusTotal >= 60 },
    { id: 'lvl5', icon: 'trophy', title: 'Best friends', desc: `Reach level 5 with ${m.name}`, unlocked: lvl.level >= 5 },
  ];

  return (
    <Animated.ScrollView style={{ flex: 1, backgroundColor: colors.canvas }} contentContainerStyle={{ paddingBottom: insets.bottom + 110 }} showsVerticalScrollIndicator={false}>
      <View style={{ paddingTop: insets.top + spacing.sm }}>
        <LinearGradient colors={[m.gradient[0], colors.canvas]} style={[StyleSheet.absoluteFill, { height: 520 }]} />
        <View style={styles.header}>
          <View style={[styles.level, { backgroundColor: '#ffffffcc' }]}>
            <Ionicons name="star" size={14} color={colors.gold} />
            <T variant="footnote" style={{ fontFamily: 'Nunito_800ExtraBold' }}>
              Level {lvl.level}
            </T>
          </View>
          <View style={[styles.level, { backgroundColor: '#ffffffcc' }]}>
            <T style={{ fontSize: 14 }}>{mood.emoji}</T>
            <T variant="footnote" color={mood.color} style={{ fontFamily: 'Nunito_800ExtraBold' }}>
              {mood.label}
            </T>
          </View>
        </View>

        <View style={{ alignItems: 'center', marginTop: spacing.sm }}>
          <Animated.View key={line} entering={FadeIn.duration(250)} style={[styles.bubble, shadow.card]}>
            <T variant="callout" align="center" style={{ fontFamily: 'Nunito_700Bold' }}>
              {line}
            </T>
            <View style={styles.bubbleTail} />
          </Animated.View>
          <Pressable onPress={pet} accessibilityRole="button" accessibilityLabel={`Pet ${m.name}`}>
            <Animated.View style={bounceStyle}>
              <MascotArt mascot={m} size={240} />
            </Animated.View>
            {pets.map((id, i) => (
              <Animated.View key={id} entering={ZoomIn.duration(200)} exiting={FadeOutUp.duration(600)} style={[styles.heart, { left: 70 + ((i * 37) % 100), top: 30 + ((i * 23) % 40) }]}>
                <Ionicons name="heart" size={26} color="#FF6B8A" />
              </Animated.View>
            ))}
          </Pressable>
          <T variant="display" style={{ marginTop: spacing.xs }}>
            {m.name}
          </T>
          <T variant="subhead" color={colors.inkMute}>
            {m.species} · Tap to say hi
          </T>
        </View>

        <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.lg }}>
          <Card>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs }}>
              <T variant="headline">Friendship level {lvl.level}</T>
              <T variant="subhead" color={colors.inkMute}>
                {lvl.into}/{lvl.per} XP
              </T>
            </View>
            <ProgressBar progress={lvl.progress} color={m.accent} height={12} />
            <T variant="footnote" color={colors.inkMute} style={{ marginTop: spacing.xs }}>
              Earn XP with focus sessions and daily challenges.
            </T>
          </Card>

          <View style={styles.stats}>
            {[
              { v: `${days}`, l: days === 1 ? 'day together' : 'days together' },
              { v: formatMinutes(focusTotal, true), l: 'focused' },
              { v: `${challengeTotal}`, l: 'challenges' },
            ].map((s) => (
              <Card key={s.l} style={styles.stat} padded={false}>
                <T variant="statSm">{s.v}</T>
                <T variant="caption" color={colors.inkMute}>
                  {s.l}
                </T>
              </Card>
            ))}
          </View>

          <SectionHeader title="Achievements" action={`${badges.filter((b) => b.unlocked).length}/${badges.length}`} />
          <View style={styles.badges}>
            {badges.map((b) => (
              <View key={b.id} style={[styles.badge, !b.unlocked && { opacity: 0.5 }]}>
                <View style={[styles.badgeIcon, { backgroundColor: b.unlocked ? m.accent : colors.canvasDeep }]}>
                  <Ionicons name={b.unlocked ? b.icon : 'lock-closed'} size={22} color={b.unlocked ? '#fff' : colors.inkMute} />
                </View>
                <T variant="footnote" align="center" style={{ fontFamily: 'Nunito_800ExtraBold', marginTop: 6 }} numberOfLines={1}>
                  {b.title}
                </T>
                <T variant="caption" color={colors.inkMute} align="center" numberOfLines={2} style={{ fontFamily: 'Nunito_600SemiBold' }}>
                  {b.desc}
                </T>
              </View>
            ))}
          </View>

          <SectionHeader title={`About ${m.name}`} />
          <Card>
            <T variant="body" color={colors.inkSoft}>
              {m.description}
            </T>
            <View style={styles.traits}>
              {m.traits.map((t) => (
                <View key={t} style={[styles.trait, { backgroundColor: m.accentSoft }]}>
                  <T variant="caption" color={m.accentDeep} style={{ fontFamily: 'Nunito_800ExtraBold' }}>
                    {t}
                  </T>
                </View>
              ))}
            </View>
          </Card>

          <Button title="Switch buddy" variant="outline" color={colors.ink} icon="swap-horizontal" style={{ marginTop: spacing.lg }} onPress={() => router.push('/choose-buddy')} />
        </View>
      </View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.lg },
  level: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 7, borderRadius: radius.pill },
  bubble: { backgroundColor: colors.surface, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.lg, maxWidth: 300, marginBottom: -spacing.xs, zIndex: 2 },
  bubbleTail: {
    position: 'absolute',
    bottom: -7,
    alignSelf: 'center',
    width: 14,
    height: 14,
    backgroundColor: colors.surface,
    transform: [{ rotate: '45deg' }],
    borderRadius: 3,
  },
  heart: { position: 'absolute' },
  stats: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  stat: { flex: 1, alignItems: 'center', paddingVertical: spacing.md, borderRadius: radius.lg },
  badges: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: spacing.sm },
  badge: { width: '31.5%', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.sm, paddingVertical: spacing.md, ...shadow.card },
  badgeIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  traits: { flexDirection: 'row', gap: spacing.xs, marginTop: spacing.md },
  trait: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill },
});
