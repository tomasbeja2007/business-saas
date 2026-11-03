import { Ionicons } from '@expo/vector-icons';
import { type ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  StyleSheet,
  Switch,
  Text,
  type TextProps,
  type TextStyle,
  View,
  type ViewStyle,
  type StyleProp,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { haptic } from '../lib/haptics';
import { colors, hitSlop, radius, shadow, spacing, type } from '../theme/tokens';

type Variant = keyof typeof type;

export function T({
  variant = 'body',
  color = colors.ink,
  align,
  style,
  ...rest
}: TextProps & { variant?: Variant; color?: string; align?: TextStyle['textAlign'] }) {
  return <Text {...rest} style={[type[variant], { color }, align && { textAlign: align }, style]} />;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Pressable with a soft spring "squish" — used by every tappable surface. */
export function Squish({
  children,
  style,
  scaleTo = 0.97,
  onPress,
  hapticStyle = 'tap',
  disabled,
  ...rest
}: PressableProps & { style?: StyleProp<ViewStyle>; scaleTo?: number; hapticStyle?: keyof typeof haptic | 'none'; children?: ReactNode }) {
  const s = useSharedValue(1);
  const a = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled}
      accessibilityRole={rest.accessibilityRole ?? 'button'}
      onPressIn={(e) => {
        s.value = withSpring(scaleTo, { damping: 18, stiffness: 400 });
        rest.onPressIn?.(e);
      }}
      onPressOut={(e) => {
        s.value = withSpring(1, { damping: 14, stiffness: 300 });
        rest.onPressOut?.(e);
      }}
      onPress={(e) => {
        if (hapticStyle !== 'none') haptic[hapticStyle]();
        onPress?.(e);
      }}
      style={[style, a]}
    >
      {children}
    </AnimatedPressable>
  );
}

export function Button({
  title,
  onPress,
  color = colors.ink,
  textColor = colors.onAccent,
  variant = 'solid',
  icon,
  iconRight,
  disabled,
  loading,
  style,
  size = 'lg',
}: {
  title: string;
  onPress?: () => void;
  color?: string;
  textColor?: string;
  variant?: 'solid' | 'soft' | 'outline' | 'ghost';
  icon?: keyof typeof Ionicons.glyphMap;
  iconRight?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  size?: 'lg' | 'md' | 'sm';
}) {
  const h = size === 'lg' ? 58 : size === 'md' ? 48 : 38;
  const bg =
    variant === 'solid' ? color : variant === 'soft' ? `${color}1A` : 'transparent';
  const fg = variant === 'solid' ? textColor : color;
  return (
    <Squish
      onPress={onPress}
      disabled={disabled || loading}
      hapticStyle={variant === 'solid' ? 'medium' : 'tap'}
      style={[
        styles.btn,
        {
          height: h,
          backgroundColor: bg,
          borderRadius: size === 'sm' ? radius.pill : radius.lg,
          paddingHorizontal: size === 'sm' ? 14 : 22,
          opacity: disabled ? 0.38 : 1,
        },
        variant === 'outline' && { borderWidth: 1.5, borderColor: colors.hairlineStrong },
        variant === 'solid' && !disabled && shadow.button,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={size === 'sm' ? 16 : 20} color={fg} />}
          <T variant={size === 'sm' ? 'footnote' : 'button'} color={fg} style={size === 'sm' && { fontFamily: 'Nunito_800ExtraBold' }}>
            {title}
          </T>
          {iconRight && <Ionicons name={iconRight} size={size === 'sm' ? 16 : 20} color={fg} />}
        </>
      )}
    </Squish>
  );
}

export function IconButton({
  icon,
  onPress,
  color = colors.ink,
  bg = colors.surface,
  size = 40,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  color?: string;
  bg?: string;
  size?: number;
  label: string;
}) {
  return (
    <Squish
      onPress={onPress}
      hitSlop={hitSlop}
      accessibilityLabel={label}
      scaleTo={0.9}
      style={[{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }, bg === colors.surface && shadow.card]}
    >
      <Ionicons name={icon} size={size * 0.5} color={color} />
    </Squish>
  );
}

export function Card({ children, style, padded = true }: { children: ReactNode; style?: StyleProp<ViewStyle>; padded?: boolean }) {
  return <View style={[styles.card, padded && { padding: spacing.lg }, style]}>{children}</View>;
}

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <T variant="title3">{title}</T>
      {action && (
        <Pressable onPress={onAction} hitSlop={hitSlop} accessibilityRole="button">
          <T variant="subhead" color={colors.inkMute}>
            {action}
          </T>
        </Pressable>
      )}
    </View>
  );
}

export function Pill({ label, color, bg, icon, style }: { label: string; color: string; bg: string; icon?: keyof typeof Ionicons.glyphMap; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.pill, { backgroundColor: bg }, style]}>
      {icon && <Ionicons name={icon} size={13} color={color} />}
      <T variant="caption" color={color}>
        {label}
      </T>
    </View>
  );
}

export function ProgressBar({ progress, color, track = colors.hairline, height = 8 }: { progress: number; color: string; track?: string; height?: number }) {
  const p = Math.max(0, Math.min(1, progress));
  return (
    <View style={{ height, borderRadius: height, backgroundColor: track, overflow: 'hidden' }}>
      <View style={{ width: `${p * 100}%`, height: '100%', borderRadius: height, backgroundColor: color }} />
    </View>
  );
}

type RowProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  iconBg?: string;
  iconColor?: string;
  title: string;
  subtitle?: string;
  value?: string;
  onPress?: () => void;
  right?: ReactNode;
  last?: boolean;
  destructive?: boolean;
};

export function Row({
  icon,
  iconBg = colors.primarySoft,
  iconColor = colors.primary,
  title,
  subtitle,
  value,
  onPress,
  right,
  last,
  destructive,
}: {
  icon?: keyof typeof Ionicons.glyphMap;
  iconBg?: string;
  iconColor?: string;
  title: string;
  subtitle?: string;
  value?: string;
  onPress?: () => void;
  right?: ReactNode;
  last?: boolean;
  destructive?: boolean;
}) {
  const content = (
    <View style={[styles.row, !last && styles.rowDivider]}>
      {icon && (
        <View style={[styles.rowIcon, { backgroundColor: iconBg }]}>
          <Ionicons name={icon} size={18} color={iconColor} />
        </View>
      )}
      <View style={{ flex: 1 }}>
        <T variant="callout" color={destructive ? colors.danger : colors.ink} style={{ fontFamily: 'Nunito_700Bold' }}>
          {title}
        </T>
        {subtitle && (
          <T variant="footnote" color={colors.inkMute}>
            {subtitle}
          </T>
        )}
      </View>
      {value && (
        <T variant="subhead" color={colors.inkMute}>
          {value}
        </T>
      )}
      {right}
      {onPress && !right && <Ionicons name="chevron-forward" size={18} color={colors.inkFaint} />}
    </View>
  );
  if (!onPress) return content;
  return (
    <Pressable onPress={() => { haptic.tap(); onPress(); }} style={({ pressed }) => pressed && { opacity: 0.6 }} accessibilityRole="button">
      {content}
    </Pressable>
  );
}

export function ToggleRow({
  value,
  onChange,
  accent,
  ...row
}: Omit<RowProps, 'right' | 'onPress' | 'value'> & { value: boolean; onChange: (v: boolean) => void; accent: string }) {
  return (
    <Row
      {...row}
      right={
        <Switch
          value={value}
          onValueChange={(v) => {
            haptic.select();
            onChange(v);
          }}
          trackColor={{ true: accent, false: '#E3E1EA' }}
          thumbColor="#fff"
          {...({ activeThumbColor: "#fff" } as object)}
          ios_backgroundColor="#E3E1EA"
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  card: { backgroundColor: colors.surface, borderRadius: radius.xl, ...shadow.card },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill, alignSelf: 'flex-start' },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 14, minHeight: 56 },
  rowDivider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.hairlineStrong },
  rowIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
});
