import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {

  constructor(
    private menu: MenuController,
    private router: Router,
    private platform: Platform,
    private storageService: StorageService
  ) {
    this.initializeApp();
  }

  async initializeApp(): Promise<void> {
    try {
      await this.platform.ready();
      console.log('📱 Plataforma lista');
      
      //  Inicializar Storage
      await this.storageService.init();
      console.log('✅ Storage inicializado correctamente');
      
    } catch (error) {
      console.error('❌ Error al inicializar la aplicación:', error);
    }
  }

  async cerrarSesion(): Promise<void> {
    try {
      console.log('🔐 Cerrando sesión...');
      
      //  Limpiar sesión del Storage
      await this.storageService.clearSession();
      
      // Cerrar el menú
      await this.menu.close('mainMenu');
      
      // Navegar al login
      this.router.navigate(['/login']);
      
      console.log('✅ Sesión cerrada exitosamente');
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
    }
  }
}
