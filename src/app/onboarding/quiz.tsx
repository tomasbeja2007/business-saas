import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { OnboardingShell } from '../../components/OnboardingShell';
import { Button, Squish, T } from '../../components/ui';
import { AppIcon } from '../../components/visuals';
import { APPS } from '../../data/apps';
import { QUIZ, type QuizOption } from '../../data/quiz';
import { haptic } from '../../lib/haptics';
import { useApp } from '../../store/useApp';
import { colors, radius, shadow, spacing } from '../../theme/tokens';

export default function Quiz() {
  const answers = useApp((s) => s.answers);
  const setAnswer = useApp((s) => s.setAnswer);
  const name = useApp((s) => s.name);
  const [step, setStep] = useState(0);
  const advancing = useRef(false);
  const q = QUIZ[step];
  const selected = answers[q.id] ?? [];

  const goNext = () => {
    advancing.current = false;
    if (step < QUIZ.length - 1) setStep(step + 1);
    else router.push('/onboarding/insight');
  };

  const pick = (opt: QuizOption) => {
    if (q.multi) {
      haptic.select();
      setAnswer(q.id, selected.includes(opt.id) ? selected.filter((s) => s !== opt.id) : [...selected, opt.id]);
      return;
    }
    if (advancing.current) return;
    haptic.select();
    setAnswer(q.id, [opt.id]);
    advancing.current = true;
    setTimeout(goNext, 280);
  };

  const title = step === 0 && name ? `Nice to meet you, ${name}! ${q.title}` : q.title;

  return (
    <OnboardingShell
      progress={0.1 + (step / QUIZ.length) * 0.55}
      onBack={() => (step > 0 ? setStep(step - 1) : router.back())}
      footer={
        q.multi ? (
          <Button title={selected.length ? `Continue (${selected.length})` : 'Continue'} onPress={goNext} disabled={!selected.length} />
        ) : undefined
      }
    >
      <Animated.View key={q.id} entering={FadeInRight.duration(320)} exiting={FadeOutLeft.duration(200)}>
        <T variant="overline" color={colors.primary} style={{ marginTop: spacing.lg }}>
          Question {step + 1} of {QUIZ.length}
        </T>
        <T variant="title1" style={{ marginTop: spacing.xs }}>
          {title}
        </T>
        {q.subtitle && (
          <T variant="body" color={colors.inkSoft} style={{ marginTop: spacing.xs }}>
            {q.subtitle}
          </T>
        )}

        {q.layout === 'grid' ? (
          <View style={styles.grid}>
            {q.options.map((o, i) => {
              const on = selected.includes(o.id);
              const app = APPS[o.id];
              return (
                <Animated.View key={o.id} entering={FadeIn.delay(i * 30)} style={{ width: '31%' }}>
                  <Squish onPress={() => pick(o)} hapticStyle="none" style={[styles.tile, on && styles.tileOn]} accessibilityState={{ selected: on }}>
                    {app && <AppIcon app={app} size={44} />}
                    <T variant="footnote" style={{ marginTop: 8, fontFamily: 'Nunito_700Bold' }} numberOfLines={1}>
                      {o.label}
                    </T>
                    {on && (
                      <View style={styles.tileCheck}>
                        <Ionicons name="checkmark" size={13} color="#fff" />
                      </View>
                    )}
                  </Squish>
                </Animated.View>
              );
            })}
          </View>
        ) : (
          <View style={{ gap: spacing.sm, marginTop: spacing.xl }}>
            {q.options.map((o, i) => {
              const on = selected.includes(o.id);
              return (
                <Animated.View key={o.id} entering={FadeIn.delay(i * 40)}>
                  <Squish onPress={() => pick(o)} hapticStyle="none" style={[styles.option, on && styles.optionOn]} accessibilityState={{ selected: on }}>
                    {o.emoji ? (
                      <View style={[styles.lead, on && { backgroundColor: '#fff' }]}>
                        <T style={{ fontSize: 22, lineHeight: 28 }}>{o.emoji}</T>
                      </View>
                    ) : o.icon ? (
                      <View style={[styles.lead, on && { backgroundColor: '#fff' }]}>
                        <Ionicons name={o.icon} size={21} color={colors.primary} />
                      </View>
                    ) : null}
                    <T variant="headline" style={{ flex: 1 }}>
                      {o.label}
                    </T>
                    <View style={[styles.radio, on && styles.radioOn]}>{on && <Ionicons name="checkmark" size={14} color="#fff" />}</View>
                  </Squish>
                </Animated.View>
              );
            })}
          </View>
        )}
      </Animated.View>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 64,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadow.card,
  },
  optionOn: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  lead: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.canvas, alignItems: 'center', justifyContent: 'center' },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.hairlineStrong, alignItems: 'center', justifyContent: 'center' },
  radioOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: spacing.sm, marginTop: spacing.xl },
  tile: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadow.card,
  },
  tileOn: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  tileCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
