export default {
  expo: {
    name: "Smart Attendance",
    slug: "smart-attendance",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    scheme: "smartattendance",
    splash: {
      resizeMode: "contain",
      backgroundColor: "#5B7FFF"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    android: {
      package: "com.smartattendance.app",
      googleServicesFile: "./google-services.json",
      permissions: [
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.RECEIVE_BOOT_COMPLETED",
        "android.permission.VIBRATE",
        "android.permission.POST_NOTIFICATIONS"
      ]
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.smartattendance.app",
      infoPlist: {
        NSLocationWhenInUseUsageDescription: "Yoklama doğrulaması için konum bilginize ihtiyaç var.",
        NSLocationAlwaysUsageDescription: "Yoklama doğrulaması için konum bilginize ihtiyaç var."
      }
    },
    web: {},
    plugins: [
      [
        "expo-camera",
        {
          cameraPermission: "Allow Smart Attendance to access your camera for Face ID and QR code scanning."
        }
      ],
      [
        "expo-notifications",
        {
          icon: "./assets/notification-icon.png",
          color: "#2563EB",
          defaultChannel: "default",
          androidMode: "default",
          androidCollapsedTitle: "Smart Attendance"
        }
      ],
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "Yoklama doğrulaması için konumunuza erişmemiz gerekiyor."
        }
      ],
      "expo-router"
    ],
    extra: {
      // Environment variables - accessible via Constants.expoConfig.extra
      API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:5000/api',
      eas: {
        // Leave empty if not configured yet; notification service handles it safely.
        projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID || ''
      }
    }
  }
};
