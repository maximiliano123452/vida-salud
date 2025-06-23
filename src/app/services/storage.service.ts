import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storageReady = false;
  
  constructor(private storage: Storage) {
    this.init();
  }
  
  async init() {
    try {
      await this.storage.create();
      this.storageReady = true;
      console.log('✅ Storage inicializado correctamente');
      
      // Debug: Mostrar usuarios existentes
      const usuarios = await this.getAllUsers();
      console.log('👥 Usuarios registrados:', usuarios.length);
      if (usuarios.length > 0) {
        console.log('📋 Lista de usuarios:', usuarios.map(u => `${u.email} (${u.nombre})`));
      }
      
      // Debug: Mostrar sesión actual
      const session = await this.getSession();
      if (session) {
        console.log('🔐 Sesión activa detectada:', session.email);
      } else {
        console.log('🔓 No hay sesión activa');
      }
      
    } catch (error) {
      console.error('❌ Error al inicializar storage:', error);
    }
  }
  
  // Esperar a que el storage esté listo
  private async waitForStorage() {
    while (!this.storageReady) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  async guardarUsuario(usuario: any): Promise<void> {
    await this.waitForStorage();
    try {
      const usuarios: any[] = await this.storage.get('usuarios') || [];
      usuarios.push(usuario);
      await this.storage.set('usuarios', usuarios);
      console.log('✅ Usuario guardado correctamente:', usuario.email);
      console.log('📊 Total usuarios registrados:', usuarios.length);
    } catch (error) {
      console.error('❌ Error al guardar usuario:', error);
      throw error;
    }
  }
  
  async existeUsuario(email: string): Promise<boolean> {
    await this.waitForStorage();
    try {
      const usuarios: any[] = await this.storage.get('usuarios') || [];
      const existe = usuarios.some((u: any) => u.email === email);
      console.log(`🔍 Verificando si existe ${email}:`, existe);
      return existe;
    } catch (error) {
      console.error('❌ Error al verificar usuario:', error);
      return false;
    }
  }
  
  async validarCredenciales(email: string, password: string): Promise<any | null> {
    await this.waitForStorage();
    try {
      console.log(`🔑 Validando credenciales para: ${email}`);
      const usuarios: any[] = await this.storage.get('usuarios') || [];
      console.log(`📋 Buscando en ${usuarios.length} usuarios registrados`);
      
      // Debug detallado
      usuarios.forEach((u, index) => {
        console.log(`👤 Usuario ${index + 1}: ${u.email} | Password: ${u.password}`);
      });
      
      const usuario = usuarios.find((u: any) => {
        const emailMatch = u.email === email;
        const passwordMatch = u.password === password;
        console.log(`🔍 Comparando: Email(${emailMatch}) Password(${passwordMatch})`);
        return emailMatch && passwordMatch;
      });
      
      if (usuario) {
        console.log('✅ Credenciales válidas para:', usuario.email);
        return usuario;
      } else {
        console.log('❌ Credenciales incorrectas');
        console.log('📧 Emails disponibles:', usuarios.map(u => u.email));
        return null;
      }
    } catch (error) {
      console.error('❌ Error al validar credenciales:', error);
      return null;
    }
  }
  
  async setSession(usuario: any): Promise<void> {
    await this.waitForStorage();
    try {
      await this.storage.set('session', usuario);
      console.log('🔐 Sesión establecida para:', usuario.email);
    } catch (error) {
      console.error('❌ Error al establecer sesión:', error);
      throw error;
    }
  }
  
  async getSession(): Promise<any> {
    await this.waitForStorage();
    try {
      const session = await this.storage.get('session');
      return session;
    } catch (error) {
      console.error('❌ Error al obtener sesión:', error);
      return null;
    }
  }
  
  async clearSession(): Promise<void> {
    await this.waitForStorage();
    try {
      await this.storage.remove('session');
      console.log('🔓 Sesión cerrada');
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
      throw error;
    }
  }
  
  async hasActiveSession(): Promise<boolean> {
    const session = await this.getSession();
    const hasSession = !!session;
    console.log('🔍 Verificando sesión activa:', hasSession ? '✅ SÍ' : '❌ NO');
    return hasSession;
  }
  
  // Método adicional para obtener todos los usuarios (útil para debugging)
  async getAllUsers(): Promise<any[]> {
    await this.waitForStorage();
    try {
      return await this.storage.get('usuarios') || [];
    } catch (error) {
      console.error('❌ Error al obtener usuarios:', error);
      return [];
    }
  }
  
  // Método para limpiar todos los datos (útil para testing)
  async clearAllData(): Promise<void> {
    await this.waitForStorage();
    try {
      await this.storage.clear();
      console.log('🗑️ Todos los datos eliminados');
    } catch (error) {
      console.error('❌ Error al limpiar datos:', error);
      throw error;
    }
  }
}