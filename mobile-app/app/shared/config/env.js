import Constants from 'expo-constants';

/**
 * Environment configuration for mobile app
 * Manages API URLs and environment-specific settings
 */

const ENV = {
    development: {
        // SECENEK 1 — Yerel IP (aynı WiFi ağındaysanız):
        //   ipconfig komutuyla IPv4 adresinizi bulun, buraya yazın.
        //   Mevcut IP: 192.168.1.100
        //
        // SECENEK 2 — ngrok (önerilen, IP değişse de çalışır):
        //   ngrok http 5000 → http://localhost:4040 → HTTPS URL'yi kopyalayın.
        //   Örnek: 'https://abc123.ngrok-free.app'
        //
        // NGROK KULLANIYORSANIZ aşağıdaki satırı ngrok URL ile değiştirin:
        API_URL: 'https://nongospel-aerially-tressa.ngrok-free.dev/',
        ENABLE_DEVTOOLS: true,
        LOG_LEVEL: 'debug'
    },
    production: {
        API_URL: 'https://api.smartattendance.com',
        ENABLE_DEVTOOLS: false,
        LOG_LEVEL: 'error'
    }
};

const getEnvVars = () => {
    if (__DEV__) {
        return ENV.development;
    }
    return ENV.production;
};

export const config = getEnvVars();
export const API_URL = config.API_URL;
export const ENABLE_DEVTOOLS = config.ENABLE_DEVTOOLS;
export const LOG_LEVEL = config.LOG_LEVEL;
