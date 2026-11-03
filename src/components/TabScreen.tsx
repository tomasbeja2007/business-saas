import { type ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme/tokens';
import { T } from './ui';

export function TabScreen({
  title,
  subtitle,
  right,
  children,
  header,
}: {
  title?: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
  header?: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.canvas }}
      contentContainerStyle={{ paddingTop: insets.top + spacing.sm, paddingBottom: insets.bottom + 110 }}
      showsVerticalScrollIndicator={false}
    >
      {header}
      {title && (
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, marginBottom: spacing.md }}>
          <View style={{ flex: 1 }}>
            {subtitle && (
              <T variant="footnote" color={colors.inkMute} style={{ fontFamily: 'Nunito_700Bold' }}>
                {subtitle}
              </T>
            )}
            <T variant={title.length > 18 ? 'title1' : 'largeTitle'}>{title}</T>
          </View>
          {right && <View style={{ marginLeft: spacing.sm }}>{right}</View>}
        </View>
      )}
      <View style={{ paddingHorizontal: spacing.lg }}>{children}</View>
    </ScrollView>
  );
}
