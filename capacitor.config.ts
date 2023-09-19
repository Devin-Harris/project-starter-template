import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pal.app',
  appName: 'Pal Mobile',
  webDir: 'dist/apps/frontend',
  server: {
    androidScheme: 'https',
  },
};

export default config;
