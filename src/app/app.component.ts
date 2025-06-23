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
      
      // Inicializar Storage
      await this.storageService.init();
      console.log('✅ Storage inicializado correctamente');
      
      // CREAR USUARIO DE PRUEBA AUTOMÁTICAMENTE
      await this.crearUsuarioPrueba();
      
      // Verificar sesión y navegar apropiadamente
      await this.verificarSesionInicial();
      
    } catch (error) {
      console.error('❌ Error al inicializar la aplicación:', error);
    }
  }

  // Método para crear usuario de prueba
  async crearUsuarioPrueba(): Promise<void> {
    try {
      const usuarioPrueba = {
        nombre: 'Usuario',
        apellido: 'Prueba',
        email: 'joyeriaskm@gmail.com',
        password: '1234',
        fechaNacimiento: '01/01/1990',
        nivel: 'universitario'
      };
      
      const existe = await this.storageService.existeUsuario(usuarioPrueba.email);
      if (!existe) {
        await this.storageService.guardarUsuario(usuarioPrueba);
        console.log('👤 Usuario de prueba creado:', usuarioPrueba.email);
      } else {
        console.log('👤 Usuario de prueba ya existe');
      }
    } catch (error) {
      console.error('❌ Error al crear usuario de prueba:', error);
    }
  }

  // Verificar sesión inicial y navegar apropiadamente
  async verificarSesionInicial(): Promise<void> {
    try {
      const hasSession = await this.storageService.hasActiveSession();
      
      if (hasSession) {
        const session = await this.storageService.getSession();
        console.log('🔐 Sesión activa encontrada para:', session?.email);
        // No navegar aquí, dejar que los guards manejen la navegación
      } else {
        console.log('🔓 Sin sesión activa');
        // No navegar aquí, dejar que los guards manejen la navegación
      }
    } catch (error) {
      console.error('❌ Error al verificar sesión inicial:', error);
    }
  }

  async cerrarSesion(): Promise<void> {
    try {
      console.log('🔐 Cerrando sesión...');
      
      // Limpiar sesión del Storage
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