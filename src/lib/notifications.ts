/**
 * Local notifications: buddy nudges, the evening report, bedtime wind-down and focus-session alerts.
 * All of these are scheduled on-device (no server), so they also work in Expo Go.
 */
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { MASCOTS, type MascotId } from '../data/mascots';

const supported = Platform.OS === 'ios' || Platform.OS === 'android';
const ROUTINE_TAG = 'lumi-routine';
const FOCUS_TAG = 'lumi-focus';

if (supported) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

/** Shows the real iOS permission prompt. Resolves true when notifications are allowed. */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!supported) return true;
  try {
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;
    const asked = await Notifications.requestPermissionsAsync();
    return asked.granted;
  } catch {
    return false;
  }
}

async function cancelTagged(tag: string) {
  const all = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    all.filter((n) => n.content.data?.tag === tag).map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier)),
  );
}

function parseTime(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number);
  return { hour: h || 0, minute: m || 0 };
}

function minusMinutes({ hour, minute }: { hour: number; minute: number }, mins: number) {
  const total = (hour * 60 + minute - mins + 24 * 60) % (24 * 60);
  return { hour: Math.floor(total / 60), minute: total % 60 };
}

/** Rebuilds the recurring schedule from the user's current settings. Safe to call often. */
export async function syncRoutineNotifications(opts: {
  enabled: boolean;
  dailyReport: boolean;
  windDown: boolean;
  bedtime: string;
  mascotId: MascotId;
  name: string;
}) {
  if (!supported) return;
  try {
    await cancelTagged(ROUTINE_TAG);
    if (!opts.enabled) return;
    const perm = await Notifications.getPermissionsAsync();
    if (!perm.granted) return;
    const m = MASCOTS[opts.mascotId];
    const data = { tag: ROUTINE_TAG };
    const daily = (hour: number, minute: number) => ({ type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute }) as const;

    await Notifications.scheduleNotificationAsync({
      content: { title: m.name, body: m.nudges[0], data },
      trigger: daily(14, 30),
    });
    if (opts.dailyReport) {
      await Notifications.scheduleNotificationAsync({
        content: { title: `Your day with ${m.name}`, body: `${opts.name ? `${opts.name}, your` : 'Your'} daily screen time report is ready.`, data },
        trigger: daily(21, 0),
      });
    }
    if (opts.windDown) {
      const t = minusMinutes(parseTime(opts.bedtime), 30);
      await Notifications.scheduleNotificationAsync({
        content: { title: 'Time to wind down 🌙', body: `Bedtime in 30 minutes. ${m.name} is getting cozy, join them?`, data },
        trigger: daily(t.hour, t.minute),
      });
    }
  } catch {
    // Scheduling is best effort; the app works without it.
  }
}

export async function scheduleFocusEnd(seconds: number, mascotId: MascotId, label: string) {
  if (!supported || seconds < 1) return;
  try {
    await cancelTagged(FOCUS_TAG);
    const m = MASCOTS[mascotId];
    await Notifications.scheduleNotificationAsync({
      content: { title: `${label} complete! 🎉`, body: `${m.cheers[0]} Come back to collect your XP.`, data: { tag: FOCUS_TAG } },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: Math.round(seconds) },
    });
  } catch {}
}

export async function cancelFocusEnd() {
  if (!supported) return;
  try {
    await cancelTagged(FOCUS_TAG);
  } catch {}
}
