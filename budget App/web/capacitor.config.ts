import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // Unique reverse-domain identifier — update to match your App Store / Play Store bundle ID
  appId: 'com.budgetlens.app',
  appName: 'BudgetLens',
  // Capacitor looks here for the static Next.js export
  webDir: 'out',
  // Disable live reload in production builds
  server: {
    androidScheme: 'https',
  },
  plugins: {
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#1d4ed8',
    },
    Keyboard: {
      resize: 'body',
      style: 'DARK',
      resizeOnFullScreen: true,
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1d4ed8',
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#ffffff',
      showSpinner: true,
    },
  },
};

export default config;
