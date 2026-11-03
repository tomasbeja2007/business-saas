import { router } from 'expo-router';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, hitSlop, spacing } from '../theme/tokens';
import { T } from './ui';

export function ModalHeader({ title, accent = colors.primary }: { title: string; accent?: string }) {
  const insets = useSafeAreaInsets();
  // iOS page-sheet modals sit below the status bar; elsewhere we need the inset.
  const top = Platform.OS === 'ios' ? spacing.md : insets.top + spacing.sm;
  return (
    <View style={[styles.wrap, { paddingTop: top }]}>
      <View style={styles.grabber} />
      <View style={styles.row}>
        <View style={{ width: 60 }} />
        <T variant="headline" style={{ flex: 1 }} align="center">
          {title}
        </T>
        <Pressable onPress={() => router.back()} hitSlop={hitSlop} style={{ width: 60, alignItems: 'flex-end' }} accessibilityRole="button">
          <T variant="headline" color={accent} style={{ fontFamily: 'Nunito_800ExtraBold' }}>
            Done
          </T>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm, backgroundColor: colors.canvas },
  grabber: { alignSelf: 'center', width: 36, height: 5, borderRadius: 3, backgroundColor: colors.hairlineStrong, marginBottom: spacing.sm, marginTop: -spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center' },
});
