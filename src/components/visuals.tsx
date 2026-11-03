import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, Ellipse, RadialGradient, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import type { TrackedApp } from '../data/apps';
import type { Mascot } from '../data/mascots';
import { colors } from '../theme/tokens';
import { T } from './ui';

/** Mascot artwork with a gentle idle "breathing" bob and soft ground shadow. */
export function MascotArt({
  mascot,
  size = 200,
  float = true,
  shadow = true,
  style,
}: {
  mascot: Mascot;
  size?: number;
  float?: boolean;
  shadow?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const y = useSharedValue(0);
  useEffect(() => {
    if (!float) return;
    y.value = withRepeat(
      withSequence(
        withTiming(-size * 0.03, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
    );
  }, [float, size, y]);
  const bob = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  const shadowStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: 1 + y.value / (size * 0.15) }],
    opacity: 0.6 + y.value / (size * 0.08),
  }));
  return (
    <View style={[{ width: size, height: size * 1.04, alignItems: 'center' }, style]}>
      {shadow && (
        <Animated.View style={[{ position: 'absolute', bottom: 0, width: size * 0.7, height: size * 0.1 }, shadowStyle]}>
          <Svg width="100%" height="100%" viewBox="0 0 100 20" preserveAspectRatio="none">
            <Defs>
              <RadialGradient id={`sh-${mascot.id}`} cx="50%" cy="50%" rx="50%" ry="50%">
                <Stop offset="0" stopColor={mascot.accentDeep} stopOpacity={0.55} />
                <Stop offset="1" stopColor={mascot.accentDeep} stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Ellipse cx="50" cy="10" rx="50" ry="10" fill={`url(#sh-${mascot.id})`} />
          </Svg>
        </Animated.View>
      )}
      <Animated.View style={bob}>
        <Image source={mascot.image} style={{ width: size, height: size }} contentFit="contain" transition={200} />
      </Animated.View>
    </View>
  );
}

/** Circular avatar: mascot on its soft gradient. */
export function MascotAvatar({ mascot, size = 48, ring }: { mascot: Mascot; size?: number; ring?: boolean }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: 'hidden',
        borderWidth: ring ? 2 : 0,
        borderColor: '#fff',
      }}
    >
      <LinearGradient colors={mascot.gradient} style={StyleSheet.absoluteFill} />
      <Image source={mascot.image} style={{ width: size * 1.05, height: size * 1.05, marginLeft: -size * 0.025, marginTop: size * 0.04 }} contentFit="contain" />
    </View>
  );
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function Ring({
  size = 180,
  stroke = 16,
  progress,
  color,
  colorEnd,
  track = colors.hairline,
  children,
}: {
  size?: number;
  stroke?: number;
  progress: number;
  color: string;
  colorEnd?: string;
  track?: string;
  children?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withTiming(Math.max(0, Math.min(1, progress)), { duration: 1100, easing: Easing.out(Easing.cubic) });
  }, [progress, p]);
  const props = useAnimatedProps(() => ({ strokeDashoffset: c * (1 - p.value) }));
  const gid = `g${color.replace('#', '')}`;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Defs>
          <SvgGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={color} />
            <Stop offset="1" stopColor={colorEnd ?? color} />
          </SvgGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={`url(#${gid})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${c} ${c}`}
          animatedProps={props}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {children}
    </View>
  );
}

export function AppIcon({ app, size = 40 }: { app: TrackedApp; size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.27,
        backgroundColor: app.bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ionicons name={app.icon} size={size * 0.55} color={app.color} />
    </View>
  );
}

function Bar({ value, max, color, height, delay }: { value: number; max: number; color: string; height: number; delay: number }) {
  const h = useSharedValue(0);
  useEffect(() => {
    h.value = withDelay(delay, withTiming(max ? (value / max) * height : 0, { duration: 700, easing: Easing.out(Easing.cubic) }));
  }, [value, max, height, delay, h]);
  const a = useAnimatedStyle(() => ({ height: Math.max(4, h.value) }));
  return <Animated.View style={[{ width: '100%', borderRadius: 8, backgroundColor: color }, a]} />;
}

export function BarChart({
  data,
  color,
  mutedColor,
  goal,
  height = 140,
  highlightIndex,
}: {
  data: { label: string; value: number }[];
  color: string;
  mutedColor: string;
  goal?: number;
  height?: number;
  highlightIndex?: number;
}) {
  const max = Math.max(goal ?? 0, ...data.map((d) => d.value)) * 1.1 || 1;
  return (
    <View>
      <View style={{ height, flexDirection: 'row', alignItems: 'flex-end', gap: 10 }}>
        {goal != null && (
          <View pointerEvents="none" style={[styles.goalLine, { bottom: (goal / max) * height }]}>
            <View style={styles.goalDash} />
          </View>
        )}
        {data.map((d, i) => (
          <View key={`${d.label}${i}`} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', height }}>
            <Bar value={d.value} max={max} height={height} delay={i * 60} color={i === highlightIndex ? color : mutedColor} />
          </View>
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
        {data.map((d, i) => (
          <T key={`${d.label}l${i}`} variant="caption" color={i === highlightIndex ? colors.ink : colors.inkMute} align="center" style={{ flex: 1 }}>
            {d.label}
          </T>
        ))}
      </View>
    </View>
  );
}

export function HourlyChart({ data, color, height = 70 }: { data: number[]; color: string; height?: number }) {
  const max = Math.max(...data, 1);
  return (
    <View>
      <View style={{ height, flexDirection: 'row', alignItems: 'flex-end', gap: 3 }}>
        {data.map((v, i) => (
          <View key={i} style={{ flex: 1, height: Math.max(3, (v / max) * height), borderRadius: 3, backgroundColor: v ? color : colors.hairline }} />
        ))}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
        {['12a', '6a', '12p', '6p', '12a'].map((l, i) => (
          <T key={i} variant="caption" color={colors.inkMute}>
            {l}
          </T>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  goalLine: { position: 'absolute', left: 0, right: 0, height: 0, zIndex: 2 },
  goalDash: { borderTopWidth: 1.5, borderStyle: 'dashed', borderColor: 'rgba(28,27,46,0.28)' },
});
