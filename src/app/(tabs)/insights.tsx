import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { TabScreen } from '../../components/TabScreen';
import { Card, ProgressBar, SectionHeader, Squish, T } from '../../components/ui';
import { AppIcon, BarChart, HourlyChart, MascotAvatar } from '../../components/visuals';
import { CATEGORY_COLORS } from '../../data/apps';
import { useBuddy, useUsage } from '../../lib/hooks';
import { byCategory, formatMinutes, type AppUsage } from '../../lib/usage';
import { useApp } from '../../store/useApp';
import { colors, radius, spacing } from '../../theme/tokens';

function hourLabel(h: number) {
  const ampm = h >= 12 ? 'pm' : 'am';
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}${ampm}`;
}

export default function Insights() {
  const m = useBuddy();
  const goal = useApp((s) => s.dailyGoal);
  const { week, today, prevAvg, weekAvg, focusWeek } = useUsage();
  const [range, setRange] = useState<'day' | 'week'>('week');
  const [selected, setSelected] = useState(6);
  const day = week[selected] ?? today;

  const change = prevAvg ? (weekAvg - prevAvg) / prevAvg : 0;
  const down = change <= 0;
  const daysUnder = week.slice(0, -1).filter((d) => d.total <= goal).length;

  const weekApps: AppUsage[] = (() => {
    const map = new Map<string, AppUsage>();
    week.forEach((d) =>
      d.apps.forEach((a) => {
        const e = map.get(a.app.id);
        map.set(a.app.id, e ? { ...e, minutes: e.minutes + a.minutes, pickups: e.pickups + a.pickups } : { ...a });
      }),
    );
    return [...map.values()].sort((a, b) => b.minutes - a.minutes);
  })();
  const apps = range === 'week' ? weekApps : day.apps;
  const cats = byCategory(range === 'week' ? { ...today, apps: weekApps } : day);
  const catTotal = cats.reduce((a, b) => a + b.minutes, 0) || 1;
  const peakHour = today.hourly.indexOf(Math.max(...today.hourly));
  const topApp = weekApps[0];

  const tips = [
    {
      icon: 'time-outline' as const,
      title: `Your peak hour is ${hourLabel(peakHour)}`,
      body: `Try a focus session or wind-down right before ${hourLabel(peakHour)} — that’s when the scroll pulls hardest.`,
    },
    topApp && {
      icon: 'apps-outline' as const,
      title: `${topApp.app.name} takes ${Math.round((topApp.minutes / Math.max(1, weekApps.reduce((a, b) => a + b.minutes, 0))) * 100)}% of your time`,
      body: `Setting a ${formatMinutes(Math.max(15, Math.round(topApp.minutes / 7 / 2 / 15) * 15), true)} daily limit would halve it.`,
    },
    {
      icon: 'trophy-outline' as const,
      title: `${daysUnder} of 6 days under goal`,
      body: daysUnder >= 4 ? 'Excellent consistency. Keep the streak alive!' : 'Small wins add up — aim for one more day under goal this week.',
    },
  ].filter(Boolean) as { icon: keyof typeof Ionicons.glyphMap; title: string; body: string }[];

  return (
    <TabScreen title="Insights" subtitle="Your screen time, decoded">
      <View style={styles.segment}>
        {(['day', 'week'] as const).map((r) => (
          <Squish key={r} hapticStyle="select" onPress={() => setRange(r)} style={[styles.segBtn, range === r && styles.segOn]}>
            <T variant="subhead" color={range === r ? colors.ink : colors.inkMute} style={{ fontFamily: 'Nunito_800ExtraBold' }}>
              {r === 'day' ? 'Day' : 'Week'}
            </T>
          </Squish>
        ))}
      </View>

      <Animated.View key={range} entering={FadeIn.duration(300)}>
        <Card style={{ marginTop: spacing.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <T variant="overline" color={colors.inkMute}>
                {range === 'week' ? 'Daily average' : day.isToday ? 'Today so far' : day.date.toLocaleDateString(undefined, { weekday: 'long' })}
              </T>
              <T variant="stat" style={{ marginTop: 4 }}>
                {formatMinutes(range === 'week' ? weekAvg : day.total, true)}
              </T>
            </View>
            {range === 'week' && (
              <View style={[styles.delta, { backgroundColor: down ? colors.successSoft : colors.dangerSoft }]}>
                <Ionicons name={down ? 'arrow-down' : 'arrow-up'} size={14} color={down ? colors.success : colors.danger} />
                <T variant="caption" color={down ? colors.success : colors.danger} style={{ fontFamily: 'Nunito_800ExtraBold' }}>
                  {Math.abs(Math.round(change * 100))}% vs last week
                </T>
              </View>
            )}
          </View>
          <View style={{ marginTop: spacing.lg }}>
            {range === 'week' ? (
              <>
                <BarChart
                  data={week.map((d) => ({ label: d.isToday ? 'Today' : d.label, value: d.total }))}
                  color={m.accent}
                  mutedColor={`${m.accent}55`}
                  goal={goal}
                  highlightIndex={selected}
                />
                <View style={styles.dayPicker}>
                  {week.map((d, i) => (
                    <Squish key={d.key} hapticStyle="select" onPress={() => setSelected(i)} style={{ flex: 1, height: 28 }} accessibilityLabel={`Select ${d.label}`}>
                      <View />
                    </Squish>
                  ))}
                </View>
              </>
            ) : (
              <HourlyChart data={day.hourly} color={m.accent} />
            )}
          </View>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDash]} />
              <T variant="caption" color={colors.inkMute}>
                Goal {formatMinutes(goal, true)}
              </T>
            </View>
            <T variant="caption" color={colors.inkMute}>
              {range === 'week' ? `${day.isToday ? 'Today' : day.label}: ${formatMinutes(day.total, true)}` : `${day.pickups} pickups`}
            </T>
          </View>
        </Card>

        <View style={styles.kpis}>
          <Card style={styles.kpi}>
            <Ionicons name="phone-portrait-outline" size={18} color={m.accentDeep} />
            <T variant="statSm" style={{ marginTop: 6 }}>
              {range === 'week' ? Math.round(week.reduce((a, d) => a + d.pickups, 0) / 7) : day.pickups}
            </T>
            <T variant="caption" color={colors.inkMute}>
              {range === 'week' ? 'pickups / day' : 'pickups'}
            </T>
          </Card>
          <Card style={styles.kpi}>
            <Ionicons name="timer-outline" size={18} color={colors.success} />
            <T variant="statSm" style={{ marginTop: 6 }}>
              {formatMinutes(focusWeek, true)}
            </T>
            <T variant="caption" color={colors.inkMute}>
              focused this week
            </T>
          </Card>
        </View>

        <SectionHeader title="By category" />
        <Card>
          <View style={styles.stack}>
            {cats.map((c) => (
              <View key={c.category} style={{ flex: c.minutes / catTotal, backgroundColor: CATEGORY_COLORS[c.category] }} />
            ))}
          </View>
          <View style={{ marginTop: spacing.md, gap: 10 }}>
            {cats.map((c) => (
              <View key={c.category} style={styles.catRow}>
                <View style={[styles.catDot, { backgroundColor: CATEGORY_COLORS[c.category] }]} />
                <T variant="callout" style={{ flex: 1, fontFamily: 'Nunito_700Bold' }}>
                  {c.category}
                </T>
                <T variant="subhead" color={colors.inkMute}>
                  {formatMinutes(range === 'week' ? c.minutes / 7 : c.minutes, true)}
                  {range === 'week' ? '/day' : ''}
                </T>
              </View>
            ))}
          </View>
        </Card>

        <SectionHeader title={`Tips from ${m.name}`} />
        <View style={{ gap: spacing.sm }}>
          {tips.map((tip, i) => (
            <Animated.View key={tip.title} entering={FadeInDown.delay(i * 80)}>
              <Card style={styles.tip}>
                <View style={[styles.tipIcon, { backgroundColor: m.accentSoft }]}>
                  <Ionicons name={tip.icon} size={20} color={m.accentDeep} />
                </View>
                <View style={{ flex: 1 }}>
                  <T variant="headline">{tip.title}</T>
                  <T variant="footnote" color={colors.inkSoft} style={{ marginTop: 2 }}>
                    {tip.body}
                  </T>
                </View>
              </Card>
            </Animated.View>
          ))}
        </View>

        <SectionHeader title="Apps" />
        <Card>
          {apps.slice(0, 8).map((a, i) => (
            <View key={a.app.id} style={[styles.appRow, i > 0 && { marginTop: spacing.md }]}>
              <AppIcon app={a.app} size={36} />
              <View style={{ flex: 1, gap: 5 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <T variant="callout" style={{ fontFamily: 'Nunito_700Bold' }}>
                    {a.app.name}
                  </T>
                  <T variant="subhead" color={colors.inkSoft}>
                    {formatMinutes(range === 'week' ? a.minutes / 7 : a.minutes, true)}
                    {range === 'week' ? '/day' : ''}
                  </T>
                </View>
                <ProgressBar progress={a.minutes / (apps[0]?.minutes || 1)} color={CATEGORY_COLORS[a.app.category]} height={6} />
              </View>
            </View>
          ))}
        </Card>

        <View style={styles.footerNote}>
          <MascotAvatar mascot={m} size={28} />
          <T variant="caption" color={colors.inkMute} style={{ flex: 1 }}>
            {m.name} updates your insights throughout the day.
          </T>
        </View>
      </Animated.View>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  segment: { flexDirection: 'row', backgroundColor: colors.canvasDeep, borderRadius: radius.md, padding: 3 },
  segBtn: { flex: 1, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  segOn: { backgroundColor: colors.surface, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  delta: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.pill },
  dayPicker: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, flexDirection: 'row', gap: 10 },
  legendRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDash: { width: 16, borderTopWidth: 1.5, borderStyle: 'dashed', borderColor: 'rgba(28,27,46,0.35)' },
  kpis: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  kpi: { flex: 1, padding: spacing.md },
  stack: { flexDirection: 'row', height: 14, borderRadius: 7, overflow: 'hidden', gap: 2 },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  catDot: { width: 10, height: 10, borderRadius: 5 },
  tip: { flexDirection: 'row', gap: spacing.sm, padding: spacing.md },
  tipIcon: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  appRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  footerNote: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.lg, justifyContent: 'center' },
});
