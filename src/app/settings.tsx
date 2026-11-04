import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Share, StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ModalHeader } from '../components/ModalHeader';
import { Button, Card, Row, Squish, T, ToggleRow } from '../components/ui';
import { MascotAvatar } from '../components/visuals';
import { FREE_EARLY_ACCESS, PLANS } from '../data/plans';
import { useBuddy } from '../lib/hooks';
import { requestNotificationPermission } from '../lib/notifications';
import { formatMinutes } from '../lib/usage';
import { useApp } from '../store/useApp';
import { colors, fonts, radius, spacing } from '../theme/tokens';

const BEDTIMES = ['21:30', '22:00', '22:30', '23:00', '23:30', '00:00'];

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: spacing.lg }}>
      <T variant="overline" color={colors.inkMute} style={{ marginLeft: spacing.xs, marginBottom: spacing.xs }}>
        {title}
      </T>
      <Card padded={false} style={{ paddingHorizontal: spacing.md, borderRadius: radius.lg }}>
        {children}
      </Card>
    </View>
  );
}

export default function Settings() {
  const insets = useSafeAreaInsets();
  const m = useBuddy();
  const s = useApp();
  const [confirmReset, setConfirmReset] = useState(false);
  const [notifDenied, setNotifDenied] = useState(false);
  const plan = PLANS.find((p) => p.id === s.plan);
  const nextBedtime = () => {
    const i = BEDTIMES.indexOf(s.settings.bedtime);
    s.updateSettings({ bedtime: BEDTIMES[(i + 1) % BEDTIMES.length] });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.canvas }}>
      <ModalHeader title="Settings" accent={m.accentDeep} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: insets.bottom + spacing.xxl }} keyboardShouldPersistTaps="handled">
        <Card style={styles.profile}>
          <MascotAvatar mascot={m} size={60} />
          <View style={{ flex: 1 }}>
            <TextInput
              value={s.name}
              onChangeText={s.setName}
              placeholder="Your name"
              placeholderTextColor={colors.inkFaint}
              style={styles.nameInput}
              maxLength={24}
              accessibilityLabel="Your name"
            />
            <T variant="footnote" color={colors.inkMute}>
              Buddies with {m.name} · {FREE_EARLY_ACCESS ? 'Early access' : plan?.title ?? 'Free'}
            </T>
          </View>
          <Ionicons name="pencil" size={16} color={colors.inkFaint} />
        </Card>

        <Group title="Goals">
          <Row
            icon="hourglass"
            iconBg={m.accentSoft}
            iconColor={m.accentDeep}
            title="Daily screen time goal"
            right={
              <View style={styles.stepper}>
                <Squish hapticStyle="select" onPress={() => s.setDailyGoal(Math.max(30, s.dailyGoal - 15))} style={styles.stepBtn} accessibilityLabel="Decrease goal">
                  <Ionicons name="remove" size={16} color={colors.ink} />
                </Squish>
                <T variant="subhead" style={{ minWidth: 56, textAlign: 'center', fontFamily: fonts.extrabold }}>
                  {formatMinutes(s.dailyGoal, true)}
                </T>
                <Squish hapticStyle="select" onPress={() => s.setDailyGoal(Math.min(600, s.dailyGoal + 15))} style={styles.stepBtn} accessibilityLabel="Increase goal">
                  <Ionicons name="add" size={16} color={colors.ink} />
                </Squish>
              </View>
            }
          />
          <Row icon="apps" iconBg={m.accentSoft} iconColor={m.accentDeep} title="Apps & limits" value={`${Object.keys(s.limits).length} limits`} onPress={() => router.push('/limits')} />
          <Row icon="happy" iconBg={m.accentSoft} iconColor={m.accentDeep} title="Your buddy" value={m.name} onPress={() => router.push('/choose-buddy')} last />
        </Group>

        <Group title="Notifications">
          <ToggleRow icon="notifications" iconBg="#FDEEDF" iconColor="#D26A17" title="Nudges from your buddy" subtitle={notifDenied ? 'Allow Lumi in iOS Settings › Notifications' : undefined} value={s.settings.notifications} onChange={async (v) => {
            if (!v) return s.updateSettings({ notifications: false });
            const ok = await requestNotificationPermission();
            setNotifDenied(!ok);
            s.updateSettings({ notifications: ok });
          }} accent={m.accent} />
          <ToggleRow icon="document-text" iconBg="#E8EEFB" iconColor="#3F62B8" title="Daily report" subtitle="Every evening at 21:00" value={s.settings.notifications && s.settings.dailyReport} onChange={(v) => s.updateSettings({ dailyReport: v })} accent={m.accent} last />
        </Group>

        <Group title="Wind down">
          <ToggleRow icon="moon" iconBg="#E9ECFA" iconColor="#5260AE" title="Wind-down mode" subtitle={`Reminder 30 min before ${s.settings.bedtime}`} value={s.settings.windDown} onChange={(v) => s.updateSettings({ windDown: v })} accent={m.accent} />
          <Row icon="bed" iconBg="#E9ECFA" iconColor="#5260AE" title="Bedtime" value={s.settings.bedtime} onPress={nextBedtime} last />
        </Group>

        <Group title="Preferences">
          <ToggleRow icon="lock-closed" iconBg={colors.dangerSoft} iconColor={colors.danger} title="Strict mode" subtitle="No ending focus sessions early" value={s.settings.strictMode} onChange={(v) => s.updateSettings({ strictMode: v })} accent={m.accent} />
          <ToggleRow icon="pulse" iconBg={colors.successSoft} iconColor={colors.success} title="Haptics" value={s.settings.haptics} onChange={(v) => s.updateSettings({ haptics: v })} accent={m.accent} />
          <Row
            icon="hourglass-outline"
            iconBg={colors.canvasDeep}
            iconColor={colors.inkSoft}
            title="Screen Time data"
            subtitle={s.settings.screenTimeConnected ? 'Preview mode · showing sample data' : 'Not connected'}
            right={
              !s.settings.screenTimeConnected ? (
                <Button title="Connect" size="sm" color={m.accent} onPress={() => s.updateSettings({ screenTimeConnected: true })} />
              ) : undefined
            }
            last
          />
        </Group>

        <Group title="Lumi">
          <Row icon="gift" iconBg={colors.goldSoft} iconColor="#B8862A" title="Lumi Plus" value={FREE_EARLY_ACCESS ? 'Free · Early access' : plan?.title} />
          <Row
            icon="share-social"
            iconBg={colors.primarySoft}
            iconColor={colors.primary}
            title="Invite a friend"
            onPress={() => Share.share({ message: `I’m taking back my time with ${m.name} on Lumi. Find your screen-time buddy!` }).catch(() => {})}
          />
          <Row icon="star" iconBg={colors.goldSoft} iconColor="#B8862A" title="Rate Lumi" onPress={() => {}} />
          <Row icon="shield-checkmark" iconBg={colors.successSoft} iconColor={colors.success} title="Privacy" subtitle="Your data stays on this device" last />
        </Group>

        <View style={{ marginTop: spacing.xl }}>
          {confirmReset ? (
            <Animated.View entering={FadeInDown} style={styles.confirm}>
              <T variant="headline" align="center">
                Start over?
              </T>
              <T variant="footnote" color={colors.inkMute} align="center" style={{ marginTop: 4, marginBottom: spacing.md }}>
                This clears your progress and takes you back to onboarding.
              </T>
              <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                <Button title="Cancel" variant="soft" color={colors.ink} size="md" style={{ flex: 1 }} onPress={() => setConfirmReset(false)} />
                <Button
                  title="Reset"
                  color={colors.danger}
                  size="md"
                  style={{ flex: 1 }}
                  onPress={() => {
                    s.reset();
                    router.dismissAll();
                    router.replace('/onboarding');
                  }}
                />
              </View>
            </Animated.View>
          ) : (
            <Button title="Reset & restart onboarding" variant="ghost" color={colors.danger} size="md" onPress={() => setConfirmReset(true)} />
          )}
        </View>
        <T variant="caption" color={colors.inkFaint} align="center" style={{ marginTop: spacing.md }}>
          Lumi 1.0.0
        </T>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  profile: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm, padding: spacing.md },
  // @ts-expect-error web-only: hide the browser focus ring
  nameInput: { fontFamily: fonts.extrabold, fontSize: 20, color: colors.ink, padding: 0, outlineStyle: 'none' },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  stepBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.canvas, alignItems: 'center', justifyContent: 'center' },
  confirm: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.lg },
});
