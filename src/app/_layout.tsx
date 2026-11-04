import {
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
  useFonts,
} from '@expo-google-fonts/nunito';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { syncRoutineNotifications } from '../lib/notifications';
import { useApp } from '../store/useApp';
import { colors } from '../theme/tokens';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ Nunito_500Medium, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black });
  const hydrated = useApp((s) => s.hydrated);
  const ready = fontsLoaded && hydrated;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  // If storage is unavailable (private mode, blocked site data) rehydration may never report back.
  useEffect(() => {
    const t = setTimeout(() => {
      if (!useApp.getState().hydrated) useApp.setState({ hydrated: true });
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  const onboarded = useApp((s) => s.onboarded);
  const settings = useApp((s) => s.settings);
  const mascotId = useApp((s) => s.mascotId);
  const name = useApp((s) => s.name);
  useEffect(() => {
    if (!hydrated) return;
    syncRoutineNotifications({
      enabled: onboarded && settings.notifications,
      dailyReport: settings.dailyReport,
      windDown: settings.windDown,
      bedtime: settings.bedtime,
      mascotId,
      name,
    });
  }, [hydrated, onboarded, settings.notifications, settings.dailyReport, settings.windDown, settings.bedtime, mascotId, name]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.canvas }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.canvas } }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
          <Stack.Screen name="focus-session" options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
          <Stack.Screen name="choose-buddy" options={{ presentation: 'modal' }} />
          <Stack.Screen name="limits" options={{ presentation: 'modal' }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
