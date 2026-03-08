import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { UserProvider, useUser } from './context/UserContext';
import {
  setupPushNotifications,
  addNotificationListeners,
  removeNotificationListeners,
} from './shared/services/notificationService';

function NotificationManager() {
  const { isLoggedIn } = useUser();
  const listenersRef = useRef(null);

  useEffect(() => {
    if (!isLoggedIn) return;

    // Giriş yapınca push token al ve backend'e kaydet
    setupPushNotifications();

    // Bildirim dinleyicilerini başlat
    listenersRef.current = addNotificationListeners(
      // Uygulama açıkken gelen bildirim
      (notification) => {
        const { title, body } = notification.request.content;
        if (title && body) {
          Alert.alert(title, body);
        }
      },
      // Kullanıcı bildirime tıkladı
      (response) => {
        const data = response.notification.request.content.data;
        console.log('[Notifications] Bildirim verisi:', data);
        // İleride: data.type'a göre ilgili sayfaya yönlendir
      }
    );

    return () => {
      removeNotificationListeners(listenersRef.current);
    };
  }, [isLoggedIn]);

  return null;
}

export default function RootLayout() {
  return (
    <UserProvider>
      <StatusBar style="light" />
      <NotificationManager />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen 
          name="index" 
          options={{ 
            gestureEnabled: false,
            animation: 'none'
          }} 
        />
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            gestureEnabled: false,
            headerShown: false
          }} 
        />
      </Stack>
    </UserProvider>
  );
}
