import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'semana3',
  webDir: 'www',
  plugins: {
    StatusBar: {
      overlays: false
    }
  }
};

export default config;
