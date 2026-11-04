import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  FadeOut,
  ZoomIn,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';
import { faceFor, turnFrames, type FaceKey } from '../data/mascotArt';
import type { Mascot, MascotId } from '../data/mascots';
import { haptic } from '../lib/haptics';

export type MascotHandle = {
  /** Pop an emote bubble with one of the buddy's expressions. */
  react: (face: FaceKey, opts?: { hop?: boolean; hearts?: boolean; hold?: number }) => void;
  /** One full 360° turn using the turnaround views. */
  spin: () => void;
  hop: () => void;
};

type Personality = { breath: number; squash: number; bob: number; sway: number; hopEvery?: number };

const PERSONALITY: Record<MascotId, Personality> = {
  byte: { breath: 1700, squash: 0.02, bob: 0.025, sway: 1.5 },
  oak: { breath: 2600, squash: 0.022, bob: 0.012, sway: 3.2 },
  volt: { breath: 1050, squash: 0.03, bob: 0.03, sway: 2, hopEvery: 4200 },
  sage: { breath: 2100, squash: 0.018, bob: 0.04, sway: 2.2 },
  momo: { breath: 2800, squash: 0.04, bob: 0, sway: 0 },
};

const loop = (sv: SharedValue<number>, duration: number, delay = 0) => {
  sv.value = withDelay(
    delay,
    withRepeat(
      withSequence(
        withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
    ),
  );
};

/* ---------------- Ambient effects, one flavour per buddy ---------------- */

function Particle({
  size,
  duration,
  delay,
  children,
  path,
}: {
  size: number;
  duration: number;
  delay: number;
  children: React.ReactNode;
  path: (p: number) => { x: number; y: number; r?: number; s?: number; o: number };
}) {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withDelay(delay, withRepeat(withTiming(1, { duration, easing: Easing.linear }), -1));
  }, [p, delay, duration]);
  const style = useAnimatedStyle(() => {
    const v = path(p.value);
    return {
      opacity: v.o,
      transform: [{ translateX: v.x * size }, { translateY: v.y * size }, { rotate: `${v.r ?? 0}deg` }, { scale: v.s ?? 1 }],
    };
  });
  return <Animated.View style={[styles.particle, style]}>{children}</Animated.View>;
}

function Ambient({ mascot, size }: { mascot: Mascot; size: number }) {
  const s = size;
  const ico = (name: keyof typeof Ionicons.glyphMap, color: string, k = 0.11) => <Ionicons name={name} size={s * k} color={color} />;

  switch (mascot.id) {
    case 'oak':
      return (
        <>
          {[0, 1, 2].map((i) => (
            <Particle
              key={i}
              size={s}
              duration={4200 + i * 700}
              delay={i * 1400}
              path={(p) => {
                'worklet';
                const x0 = [0.12, 0.78, 0.3][i];
                return { x: x0 + Math.sin(p * Math.PI * 3) * 0.06, y: 0.05 + p * 0.7, r: -30 + p * 260, o: p < 0.1 ? p * 10 : p > 0.8 ? (1 - p) * 5 : 1 };
              }}
            >
              {ico('leaf', ['#7FA84A', '#5E8C2E', '#9CC064'][i], 0.09)}
            </Particle>
          ))}
        </>
      );
    case 'volt':
      return (
        <>
          {[0, 1].map((i) => (
            <Particle
              key={i}
              size={s}
              duration={1800}
              delay={i * 900}
              path={(p) => {
                'worklet';
                const pop = p < 0.35 ? Math.sin((p / 0.35) * Math.PI) : 0;
                return { x: i ? 0.8 : 0.08, y: i ? 0.14 : 0.36, r: i ? 15 : -15, s: 0.4 + pop * 0.8, o: pop };
              }}
            >
              {ico('flash', '#F2A13A', 0.12)}
            </Particle>
          ))}
          {[0, 1, 2].map((i) => (
            <Particle
              key={`l${i}`}
              size={s}
              duration={1400}
              delay={i * 120}
              path={(p) => {
                'worklet';
                const o = p < 0.5 ? Math.sin((p / 0.5) * Math.PI) : 0;
                return { x: 0.86 + i * 0.03, y: 0.24 + i * 0.06, r: -40 + i * 35, o };
              }}
            >
              <View style={[styles.dash, { width: s * 0.07, height: s * 0.018, backgroundColor: '#EE8530' }]} />
            </Particle>
          ))}
        </>
      );
    case 'sage':
      return (
        <>
          {[0, 1, 2].map((i) => (
            <Particle
              key={i}
              size={s}
              duration={2200 + i * 300}
              delay={i * 600}
              path={(p) => {
                'worklet';
                const tw = Math.sin(p * Math.PI);
                return { x: [0.82, 0.9, 0.06][i], y: [0.08, 0.3, 0.2][i], r: p * 90, s: 0.3 + tw * 0.8, o: tw };
              }}
            >
              {ico('sparkles', '#F2B640', [0.12, 0.08, 0.09][i])}
            </Particle>
          ))}
        </>
      );
    case 'momo':
      return (
        <>
          {[0, 1, 2].map((i) => (
            <Particle
              key={i}
              size={s}
              duration={3600}
              delay={i * 1200}
              path={(p) => {
                'worklet';
                return { x: 0.55 + p * 0.28, y: 0.25 - p * 0.28, r: -10 + p * 10, s: 0.6 + p * 0.7, o: p < 0.15 ? p / 0.15 : 1 - p };
              }}
            >
              <Text style={{ fontFamily: 'Nunito_900Black', fontSize: s * 0.1, color: mascot.accentDeep }}>z</Text>
            </Particle>
          ))}
        </>
      );
    case 'byte':
    default:
      return (
        <>
          {[0, 1, 2].map((i) => (
            <Particle
              key={i}
              size={s}
              duration={1600}
              delay={i * 180}
              path={(p) => {
                'worklet';
                const o = p < 0.6 ? Math.sin((p / 0.6) * Math.PI) : 0;
                return { x: 0.8 + i * 0.045, y: 0.06 + i * 0.05, r: [-60, -25, 5][i], o };
              }}
            >
              <View style={[styles.dash, { width: s * 0.065, height: s * 0.017, backgroundColor: '#5B7FD6' }]} />
            </Particle>
          ))}
        </>
      );
  }
}

/* ---------------- Emote bubble & hearts ---------------- */

function Emote({ mascot, face, size, side }: { mascot: Mascot; face: FaceKey; size: number; side: 'left' | 'right' }) {
  const d = Math.max(44, Math.min(78, size * 0.34));
  return (
    <Animated.View
      entering={ZoomIn.springify().damping(11).stiffness(220)}
      exiting={FadeOut.duration(220)}
      style={[styles.emote, { width: d, height: d, borderRadius: d / 2, top: -d * 0.1 }, side === 'right' ? { right: -d * 0.12 } : { left: -d * 0.35 }]}
    >
      <Image source={faceFor(mascot.id, face)} style={{ width: d * 0.84, height: d * 0.84 }} contentFit="contain" />
      <View style={[styles.emoteTail, { width: d * 0.2, height: d * 0.2, bottom: -d * 0.02 }, side === 'right' ? { left: d * 0.12 } : { right: d * 0.12 }]} />
    </Animated.View>
  );
}

function Heart({ size, i }: { size: number; i: number }) {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withTiming(1, { duration: 900 + i * 120, easing: Easing.out(Easing.quad) });
  }, [p, i]);
  const style = useAnimatedStyle(() => ({
    opacity: 1 - p.value,
    transform: [
      { translateX: (i - 1) * size * 0.18 * p.value },
      { translateY: -size * 0.35 * p.value },
      { scale: 0.6 + p.value * 0.6 },
    ],
  }));
  return (
    <Animated.View style={[styles.heart, { left: size * 0.45, top: size * 0.3 }, style]}>
      <Ionicons name="heart" size={size * 0.12} color="#FF6B8A" />
    </Animated.View>
  );
}

/* ---------------- The mascot ---------------- */

export const LivingMascot = forwardRef<
  MascotHandle,
  {
    mascot: Mascot;
    size?: number;
    /** Idle breathing / sway / bob. */
    float?: boolean;
    shadow?: boolean;
    /** Buddy-specific ambient effects (leaves, sparks, Z's…). */
    ambient?: boolean;
    /** Persistent emote bubble (e.g. 'focused' during a session). */
    face?: FaceKey | null;
    /** Tap to pet: hop, hearts and a happy face. */
    interactive?: boolean;
    onPet?: () => void;
    /** Which side the emote bubble pops on. */
    emoteSide?: 'left' | 'right';
    style?: StyleProp<ViewStyle>;
  }
>(function LivingMascot({ mascot, size = 200, float = true, shadow = true, ambient = false, face = null, interactive = false, onPet, emoteSide = 'right', style }, ref) {
  const reduce = useReducedMotion();
  const pers = PERSONALITY[mascot.id];
  const breath = useSharedValue(0);
  const sway = useSharedValue(0);
  const hopY = useSharedValue(0);
  const squash = useSharedValue(1);
  const [emote, setEmote] = useState<{ face: FaceKey; key: number } | null>(null);
  const [hearts, setHearts] = useState<number[]>([]);
  const [frame, setFrame] = useState(-1);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const frames = turnFrames(mascot.id);

  useEffect(() => {
    if (!float || reduce) {
      breath.value = 0;
      sway.value = 0;
      return;
    }
    loop(breath, pers.breath);
    loop(sway, pers.breath * 1.7, pers.breath / 2);
  }, [float, reduce, pers, breath, sway]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };

  const hop = useCallback(() => {
    if (reduce) return;
    squash.value = withSequence(
      withTiming(0.9, { duration: 90 }),
      withSpring(1.06, { damping: 6, stiffness: 300 }),
      withSpring(1, { damping: 9, stiffness: 220 }),
    );
    hopY.value = withSequence(
      withDelay(80, withTiming(-size * 0.12, { duration: 200, easing: Easing.out(Easing.quad) })),
      withTiming(0, { duration: 230, easing: Easing.in(Easing.quad) }),
      withSpring(0, { damping: 8 }),
    );
  }, [reduce, size, squash, hopY]);

  const react = useCallback<MascotHandle['react']>(
    (f, opts) => {
      setEmote({ face: f, key: Date.now() });
      if (opts?.hop !== false) hop();
      if (opts?.hearts) {
        const id = Date.now();
        setHearts((h) => [...h.slice(-2), id]);
        later(() => setHearts((h) => h.filter((x) => x !== id)), 1100);
      }
      later(() => setEmote((e) => (e && Date.now() - e.key >= (opts?.hold ?? 1800) - 50 ? null : e)), opts?.hold ?? 1800);
    },
    [hop],
  );

  const spin = useCallback(() => {
    if (reduce) return react('joy');
    const step = 85;
    frames.forEach((_, i) => later(() => setFrame(i), i * step));
    later(() => setFrame(-1), frames.length * step);
    hop();
  }, [frames, hop, react, reduce]);

  useImperativeHandle(ref, () => ({ react, spin, hop }), [react, spin, hop]);

  // Volt can't sit still: an occasional excited hop.
  useEffect(() => {
    if (!float || reduce || !pers.hopEvery) return;
    const t = setInterval(hop, pers.hopEvery);
    return () => clearInterval(t);
  }, [float, reduce, pers.hopEvery, hop]);

  const body = useAnimatedStyle(() => {
    const b = breath.value;
    return {
      transform: [
        { translateY: -b * size * pers.bob + hopY.value },
        { rotate: `${(sway.value - 0.5) * 2 * pers.sway}deg` },
        { scaleY: (1 + b * pers.squash) * squash.value },
        { scaleX: (1 - b * pers.squash * 0.6) * (2 - squash.value) },
      ],
    };
  });
  const shadowStyle = useAnimatedStyle(() => {
    const lift = (breath.value * pers.bob * size - hopY.value) / size;
    return { opacity: 0.65 - lift * 2.2, transform: [{ scaleX: 1 - lift * 1.6 }] };
  });

  const spinning = frame >= 0;
  const shownFace = emote?.face ?? face;
  const content = (
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
      {ambient && !reduce && <Ambient mascot={mascot} size={size} />}
      <Animated.View style={[{ width: size, height: size, transformOrigin: 'center bottom' }, body]}>
        <Image
          source={mascot.image}
          style={{ width: size, height: size, opacity: spinning ? 0 : 1 }}
          contentFit="contain"
        />
        {/* Turnaround frames stay mounted (hidden) so the first spin never flickers. */}
        {frames.map((f, i) => (
          <Image
            key={i}
            source={f.src}
            style={[
              StyleSheet.absoluteFill,
              { opacity: frame === i ? 1 : 0, transform: [{ scaleX: f.mirror ? -1 : 1 }], margin: size * 0.06 },
            ]}
            contentFit="contain"
          />
        ))}
      </Animated.View>
      {hearts.map((id) => [0, 1, 2].map((i) => <Heart key={`${id}-${i}`} size={size} i={i} />))}
      {shownFace && <Emote key={emote?.key ?? shownFace} mascot={mascot} face={shownFace} size={size} side={emoteSide} />}
    </View>
  );

  if (!interactive) return content;
  return (
    <Pressable
      onPress={() => {
        haptic.medium();
        react('joy', { hearts: true });
        onPet?.();
      }}
      onLongPress={() => {
        haptic.success();
        spin();
      }}
      delayLongPress={350}
      accessibilityRole="button"
      accessibilityLabel={`${mascot.name}. Tap to pet, hold to spin.`}
    >
      {content}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  particle: { position: 'absolute', left: 0, top: 0, zIndex: 3 },
  dash: { borderRadius: 4 },
  emote: {
    position: 'absolute',
    zIndex: 5,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2A2540',
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  emoteTail: { position: 'absolute', backgroundColor: '#FFFFFF', borderRadius: 3, transform: [{ rotate: '45deg' }], zIndex: -1 },
  heart: { position: 'absolute', zIndex: 6 },
});
