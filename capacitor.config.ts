import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vidasana.app',  
  appName: 'Vida Sana',      
  webDir: 'www',
  plugins: {
    StatusBar: {
      overlays: false,
      style: 'LIGHT_CONTENT',
      backgroundColor: '#ffffff'
    },
    Camera: {
      permissions: ['camera', 'photos']
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#4CAF50',
      showSpinner: true,
      spinnerColor: '#ffffff'
    }
  }
};

export default config;