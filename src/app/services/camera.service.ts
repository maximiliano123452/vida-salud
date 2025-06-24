import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor() { 
    console.log('✅ CameraService inicializado');
  }

  // Tomar foto con la cámara
  async tomarFoto(): Promise<string | null> {
    try {
      console.log('📸 Intentando tomar foto...');
      
      // Verificar si estamos en un dispositivo que soporte cámara
      if (!Capacitor.isPluginAvailable('Camera')) {
        console.warn('⚠️ Cámara no disponible en esta plataforma');
        // En web, simular una foto para testing
        if (Capacitor.getPlatform() === 'web') {
          return this.simularFotoWeb();
        }
        return null;
      }

      const image: Photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl, // Base64
        source: CameraSource.Camera, // Usar cámara directamente
        width: 500, // Limitar tamaño para optimizar
        height: 500
      });

      console.log('✅ Foto tomada exitosamente');
      return image.dataUrl || null;

    } catch (error) {
      console.error('❌ Error al tomar foto:', error);
      return null;
    }
  }

  // Seleccionar foto de la galería
  async seleccionarFoto(): Promise<string | null> {
    try {
      console.log('🖼️ Intentando seleccionar foto de galería...');
      
      if (!Capacitor.isPluginAvailable('Camera')) {
        console.warn('⚠️ Cámara no disponible en esta plataforma');
        // En web, simular una foto para testing
        if (Capacitor.getPlatform() === 'web') {
          return this.simularFotoWeb();
        }
        return null;
      }

      const image: Photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos, // Usar galería
        width: 500,
        height: 500
      });

      console.log('✅ Foto seleccionada de galería');
      return image.dataUrl || null;

    } catch (error) {
      console.error('❌ Error al seleccionar foto:', error);
      return null;
    }
  }

  // Verificar permisos (opcional)
  async verificarPermisos(): Promise<boolean> {
    try {
      //  (recordar)En Capacitor 7, los permisos se manejan automáticamente
      // cuando se intenta usar la cámara por primera vez
      console.log('🔐 Verificando permisos de cámara...');
      return true;
    } catch (error) {
      console.error('❌ Error al verificar permisos:', error);
      return false;
    }
  }

  // Verificar disponibilidad de cámara
  isCameraAvailable(): boolean {
    const available = Capacitor.isPluginAvailable('Camera');
    console.log('🔍 Cámara disponible:', available);
    return available;
  }

  // SIMULACIÓN PARA WEB - Solo para testing en navegador
  private simularFotoWeb(): string {
    console.log('🌐 Simulando foto para testing en web...');
    // Imagen base64 de prueba (pequeña imagen azul)
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
  }

  // Obtener información del dispositivo
  getDeviceInfo(): { platform: string, isMobile: boolean } {
    const platform = Capacitor.getPlatform();
    const isMobile = platform === 'ios' || platform === 'android';
    
    console.log('📱 Información del dispositivo:', { platform, isMobile });
    
    return { platform, isMobile };
  }
}
