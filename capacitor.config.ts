import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.stackloot.app',
  appName: 'StackLoot',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#020617",
      androidSplashResourceName: "splash",
      showSpinner: false
    },
    StatusBar: {
      backgroundColor: "#020617",
      style: "DARK"
    }
  }
};

export default config;
