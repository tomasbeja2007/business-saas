import { Stack } from 'expo-router';
import { colors } from '../../theme/tokens';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: colors.canvas },
      }}
    >
      <Stack.Screen name="matching" options={{ animation: 'fade', gestureEnabled: false }} />
      <Stack.Screen name="reveal" options={{ animation: 'fade', gestureEnabled: false }} />
      <Stack.Screen name="paywall" options={{ animation: 'slide_from_bottom' }} />
    </Stack>
  );
}
