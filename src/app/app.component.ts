import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { DBTaskService } from './services/dbtask.service';

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
    private dbtaskService: DBTaskService
  ) {
    this.initializeApp();
  }

  async initializeApp(): Promise<void> {
    try {
      await this.platform.ready();
      console.log('📱 Plataforma lista');
      
      await this.dbtaskService.inicializarSistema();
      console.log('✅ Sistema de base de datos inicializado correctamente');
    } catch (error) {
      console.error('❌ Error al inicializar la aplicación:', error);
    }
  }

  async cerrarSesion(): Promise<void> {
    try {
      console.log('🔐 Cerrando sesión...');
      
      // Cerrar todas las sesiones activas en la base de datos
      await this.dbtaskService.cerrarTodasLasSesiones();
      
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
