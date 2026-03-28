import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function usePushNotifications() {
  const token = useAuthStore((s) => s.token);
  const registered = useRef(false);

  useEffect(() => {
    if (!token) {
      registered.current = false;
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const { status: existing } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existing;
        if (existing !== 'granted') {
          const { status } =
            await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted' || cancelled) return;

        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync(
            'default',
            {
              name: 'Genel',
              importance:
                Notifications.AndroidImportance.DEFAULT,
            }
          );
        }

        const device = await Notifications.getDevicePushTokenAsync();
        const pushToken = device.data;
        if (!pushToken || registered.current || cancelled) return;

        await api.post('/notifications/token', {
          token: pushToken,
        });
        registered.current = true;
      } catch {
        /* FCM yapılandırılmamış veya simülatör */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);
}
