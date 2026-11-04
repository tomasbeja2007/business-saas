import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';
import { MascotAvatar } from '../../components/visuals';
import { useBuddy } from '../../lib/hooks';
import { haptic } from '../../lib/haptics';
import { colors, fonts } from '../../theme/tokens';

type IconName = keyof typeof Ionicons.glyphMap;
const icon = (on: IconName, off: IconName) =>
  function TabIcon({ color, focused }: { color: import('react-native').ColorValue; focused: boolean }) {
    return <Ionicons name={focused ? on : off} size={24} color={color as string} />;
  };

export default function TabsLayout() {
  const m = useBuddy();
  return (
    <Tabs
      screenListeners={{ tabPress: () => haptic.select() }}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: m.accentDeep,
        tabBarInactiveTintColor: colors.inkFaint,
        tabBarLabelStyle: { fontFamily: fonts.bold, fontSize: 11 },
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.hairline,
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : colors.surface,
          elevation: 0,
          ...(Platform.OS === 'web' ? { height: 68, paddingTop: 6, paddingBottom: 10 } : null),
        },
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView tint="systemChromeMaterialLight" intensity={90} style={StyleSheet.absoluteFill} />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.96)' }]} />
          ),
        sceneStyle: { backgroundColor: colors.canvas },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Today', tabBarIcon: icon('sunny', 'sunny-outline') }} />
      <Tabs.Screen name="focus" options={{ title: 'Focus', tabBarIcon: icon('timer', 'timer-outline') }} />
      <Tabs.Screen name="insights" options={{ title: 'Insights', tabBarIcon: icon('bar-chart', 'bar-chart-outline') }} />
      <Tabs.Screen
        name="buddy"
        options={{
          title: m.name,
          tabBarIcon: ({ focused }) => (
            <View style={{ borderRadius: 15, borderWidth: 2, borderColor: focused ? m.accent : 'transparent' }}>
              <MascotAvatar mascot={m} size={26} face={focused ? 'joy' : 'happy'} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
