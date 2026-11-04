import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, T } from '../components/ui';
import { LivingMascot, type MascotHandle } from '../components/LivingMascot';
import { AppIcon, Ring } from '../components/visuals';
import { cancelFocusEnd, scheduleFocusEnd } from '../lib/notifications';
import { APPS } from '../data/apps';
import { haptic } from '../lib/haptics';
import { useBuddy } from '../lib/hooks';
import { useApp } from '../store/useApp';
import { colors, radius, spacing } from '../theme/tokens';

type Phase = 'running' | 'paused' | 'confirmEnd' | 'done' | 'ended';

export default function FocusSession() {
  const insets = useSafeAreaInsets();
  const m = useBuddy();
  const params = useLocalSearchParams<{ minutes?: string; label?: string }>();
  const planned = Math.max(1, Number(params.minutes) || 25);
  const label = params.label || 'Deep work';
  const blocked = useApp((s) => s.blockedApps);
  const addSession = useApp((s) => s.addFocusSession);
  const strict = useApp((s) => s.settings.strictMode);

  const total = planned * 60;
  const [startedAt] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [phase, setPhase] = useState<Phase>('running');
  const lastTick = useRef(Date.now());
  const saved = useRef(false);
  const celebrate = useRef<MascotHandle>(null);

  // A notification fires when the session ends, even if the app is in the background.
  useEffect(() => {
    if (phase === 'running') scheduleFocusEnd(total - elapsed, m.id, label);
    else cancelFocusEnd();
    // Only reschedule when the phase changes, not on every tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);
  useEffect(() => () => void cancelFocusEnd(), []);

  useEffect(() => {
    if (phase !== 'done' && phase !== 'ended') return;
    const t = setTimeout(() => (phase === 'done' ? celebrate.current?.spin() : celebrate.current?.react('happy')), 450);
    const u = setTimeout(() => celebrate.current?.react(phase === 'done' ? 'joy' : 'happy', { hearts: phase === 'done', hop: false }), 1100);
    return () => {
      clearTimeout(t);
      clearTimeout(u);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'running') return;
    lastTick.current = Date.now();
    const t = setInterval(() => {
      const now = Date.now();
      const dt = (now - lastTick.current) / 1000;
      lastTick.current = now;
      setElapsed((e) => Math.min(total, e + dt));
    }, 250);
    return () => clearInterval(t);
  }, [phase, total]);

  useEffect(() => {
    if (elapsed >= total && phase === 'running') finish(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elapsed]);

  const finish = (completed: boolean) => {
    if (saved.current) return;
    saved.current = true;
    const minutes = Math.round(completed ? planned : elapsed / 60);
    addSession({ startedAt, plannedMinutes: planned, minutes, completed, label });
    if (completed) haptic.success();
    else haptic.warning();
    setPhase(completed ? 'done' : 'ended');
  };

  const remaining = Math.max(0, total - elapsed);
  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(Math.floor(remaining % 60)).padStart(2, '0');
  const xp = phase === 'done' ? planned * 2 : Math.round(elapsed / 120);

  if (phase === 'done' || phase === 'ended') {
    const ok = phase === 'done';
    return (
      <View style={[styles.root, { paddingTop: insets.top + spacing.xl, paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
        <LinearGradient colors={[m.gradient[0], colors.canvas]} style={StyleSheet.absoluteFill} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl }}>
          <Animated.View entering={ZoomIn.springify().damping(10)}>
            <LivingMascot ref={celebrate} mascot={m} size={220} ambient interactive />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(200)} style={{ alignItems: 'center' }}>
            <T variant="largeTitle" align="center" style={{ marginTop: spacing.lg }}>
              {ok ? m.cheers[planned % m.cheers.length] : 'Every minute counts'}
            </T>
            <T variant="body" color={colors.inkSoft} align="center" style={{ marginTop: spacing.xs }}>
              {ok
                ? `You focused for ${planned} minutes without distractions.`
                : `You stayed focused for ${Math.max(1, Math.round(elapsed / 60))} min. ${m.name} is still proud of you.`}
            </T>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(350)} style={styles.rewards}>
            <View style={styles.reward}>
              <T variant="statSm" color={m.accentDeep}>
                +{xp}
              </T>
              <T variant="caption" color={colors.inkMute}>
                XP earned
              </T>
            </View>
            <View style={styles.reward}>
              <T variant="statSm">{Math.max(1, Math.round((ok ? total : elapsed) / 60))}m</T>
              <T variant="caption" color={colors.inkMute}>
                reclaimed
              </T>
            </View>
          </Animated.View>
        </View>
        <View style={{ paddingHorizontal: spacing.xl }}>
          <Button title="Done" color={m.accent} onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.night, paddingTop: insets.top + spacing.md, paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
      <LinearGradient colors={[`${m.accentDeep}55`, colors.night]} style={StyleSheet.absoluteFill} end={{ x: 0.5, y: 0.7 }} />
      <View style={styles.top}>
        <View style={[styles.tag, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
          <View style={[styles.liveDot, { backgroundColor: phase === 'running' ? colors.success : colors.warning }]} />
          <T variant="footnote" color="#fff" style={{ fontFamily: 'Nunito_800ExtraBold' }}>
            {phase === 'paused' ? 'Paused' : label}
          </T>
        </View>
      </View>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Ring size={290} stroke={12} progress={elapsed / total} color={m.accent} colorEnd="#fff" track="rgba(255,255,255,0.1)">
          <View style={{ alignItems: 'center' }}>
            <LivingMascot mascot={m} size={130} float={phase === 'running'} shadow={false} ambient={phase === 'running'} face={phase === 'paused' || phase === 'confirmEnd' ? 'surprised' : 'focused'} />
            {/* Long-press the timer to skip ahead (handy for demos & store screenshots). */}
            <Pressable onLongPress={() => setElapsed(total - 3)} delayLongPress={1200} accessibilityLabel="Time remaining">
              <T variant="timer" color="#fff" style={{ fontSize: 54, lineHeight: 60 }}>
                {mm}:{ss}
              </T>
            </Pressable>
          </View>
        </Ring>
        <T variant="callout" color="rgba(255,255,255,0.7)" align="center" style={{ marginTop: spacing.xl, paddingHorizontal: spacing.xxl }}>
          {phase === 'paused' ? 'Take a breath. Resume when you’re ready.' : `${m.name} is guarding your focus. Distracting apps are blocked.`}
        </T>
        {blocked.length > 0 && (
          <Animated.View entering={FadeIn.delay(300)} style={styles.blockedRow}>
            {blocked.slice(0, 6).map((id) =>
              APPS[id] ? (
                <View key={id} style={{ opacity: 0.55 }}>
                  <AppIcon app={APPS[id]} size={34} />
                </View>
              ) : null,
            )}
            <Ionicons name="lock-closed" size={16} color="rgba(255,255,255,0.6)" />
          </Animated.View>
        )}
      </View>

      {phase === 'confirmEnd' ? (
        <Animated.View entering={FadeInDown} style={styles.confirm}>
          <T variant="headline" color="#fff" align="center">
            End session early?
          </T>
          <T variant="footnote" color="rgba(255,255,255,0.6)" align="center" style={{ marginTop: 4, marginBottom: spacing.md }}>
            You’ll keep the minutes you’ve focused so far.
          </T>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <Button title="Keep going" color="#fff" textColor={colors.night} style={{ flex: 1 }} size="md" onPress={() => setPhase('running')} />
            <Button title="End" variant="soft" color="#FF8A80" style={{ flex: 1 }} size="md" onPress={() => finish(false)} />
          </View>
        </Animated.View>
      ) : (
        <View style={{ flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.xl }}>
          {!strict && (
            <Button title="End" variant="soft" color="#ffffff" style={{ flex: 1 }} onPress={() => setPhase('confirmEnd')} />
          )}
          <Button
            title={phase === 'paused' ? 'Resume' : 'Pause'}
            icon={phase === 'paused' ? 'play' : 'pause'}
            color={m.accent}
            style={{ flex: 2 }}
            onPress={() => setPhase(phase === 'paused' ? 'running' : 'paused')}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  top: { alignItems: 'center' },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill },
  liveDot: { width: 8, height: 8, borderRadius: 4 },
  blockedRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: spacing.lg },
  confirm: { marginHorizontal: spacing.xl, padding: spacing.lg, borderRadius: radius.xl, backgroundColor: colors.nightSurface },
  rewards: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xl },
  reward: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, paddingVertical: spacing.md, paddingHorizontal: spacing.xl },
});
