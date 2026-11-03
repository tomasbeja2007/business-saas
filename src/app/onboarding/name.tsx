import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { OnboardingShell } from '../../components/OnboardingShell';
import { Button, T } from '../../components/ui';
import { MascotArt } from '../../components/visuals';
import { MASCOTS } from '../../data/mascots';
import { useApp } from '../../store/useApp';
import { colors, fonts, radius, spacing } from '../../theme/tokens';

export default function NameStep() {
  const stored = useApp((s) => s.name);
  const setName = useApp((s) => s.setName);
  const [name, setLocal] = useState(stored);
  const [focused, setFocused] = useState(false);
  const valid = name.trim().length > 0;

  const next = () => {
    if (!valid) return;
    setName(name.trim());
    router.push('/onboarding/quiz');
  };

  return (
    <OnboardingShell
      progress={0.06}
      footer={<Button title="Continue" onPress={next} disabled={!valid} />}
    >
      <View style={{ alignItems: 'center', marginTop: spacing.lg }}>
        <MascotArt mascot={MASCOTS.byte} size={150} />
        <View style={styles.bubble}>
          <T variant="headline" align="center">
            Hi there! 👋 Before we start…
          </T>
        </View>
      </View>
      <T variant="largeTitle" align="center" style={{ marginTop: spacing.xl }}>
        What should we call you?
      </T>
      <TextInput
        value={name}
        onChangeText={setLocal}
        placeholder="Your first name"
        placeholderTextColor={colors.inkFaint}
        autoFocus
        autoCapitalize="words"
        autoCorrect={false}
        returnKeyType="next"
        onSubmitEditing={next}
        maxLength={24}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[styles.input, focused && { borderColor: colors.primary }]}
        accessibilityLabel="Your first name"
      />
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  bubble: {
    marginTop: spacing.sm,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
  },
  input: {
    marginTop: spacing.xl,
    height: 64,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: 'transparent',
    paddingHorizontal: spacing.lg,
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.ink,
    textAlign: 'center',
    // @ts-expect-error web-only: hide the browser focus ring (we draw our own border)
    outlineStyle: 'none',
  },
});
