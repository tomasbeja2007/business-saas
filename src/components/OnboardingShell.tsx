import { router } from 'expo-router';
import { type ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme/tokens';
import { IconButton, ProgressBar, T } from './ui';

export function OnboardingShell({
  progress,
  onBack,
  title,
  subtitle,
  children,
  footer,
  accent = colors.ink,
  scroll = true,
  showBack = true,
}: {
  progress?: number;
  onBack?: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  accent?: string;
  scroll?: boolean;
  showBack?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const Body = scroll ? ScrollView : View;
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: colors.canvas }}>
      <View style={[styles.top, { paddingTop: insets.top + 8 }]}>
        <View style={{ width: 40 }}>
          {showBack && (
            <IconButton icon="chevron-back" label="Back" onPress={onBack ?? (() => router.back())} bg="transparent" />
          )}
        </View>
        <View style={{ flex: 1, paddingHorizontal: spacing.sm }}>
          {progress != null && <ProgressBar progress={progress} color={accent} height={6} />}
        </View>
        <View style={{ width: 40 }} />
      </View>
      <Body
        style={{ flex: 1 }}
        contentContainerStyle={scroll ? { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl } : undefined}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[!scroll && { flex: 1, paddingHorizontal: spacing.xl }]}>
          {title && (
            <View style={{ marginTop: spacing.lg, marginBottom: spacing.xl }}>
              <T variant="largeTitle">{title}</T>
              {subtitle && (
                <T variant="body" color={colors.inkSoft} style={{ marginTop: spacing.xs }}>
                  {subtitle}
                </T>
              )}
            </View>
          )}
          {children}
        </View>
      </Body>
      {footer && <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>{footer}</View>}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingBottom: spacing.xs },
  footer: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm, gap: spacing.sm },
});
