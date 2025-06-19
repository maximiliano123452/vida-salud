import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    console.log('✅ Storage inicializado correctamente');
    
    //  NUEVO: Crear usuarios de prueba si no existen
    await this.crearUsuariosDePrueba();
  }

  //  NUEVO: Crear usuarios de prueba para que no sea obligatorio registrarse
  async crearUsuariosDePrueba(): Promise<void> {
    const users = await this.getUsers();
    
    // Si no hay usuarios, crear algunos de prueba
    if (users.length === 0) {
      const usuariosPrueba = [
        { email: 'admin@vidasana.com', password: 'admin' },
        { email: 'usuario@gmail.com', password: '123' },
        { email: 'test@test.com', password: 'test' },
        { email: 'demo@demo.com', password: 'demo' }
      ];

      await this._storage?.set('users', usuariosPrueba);
      console.log('✅ Usuarios de prueba creados:', usuariosPrueba);
    } else {
      console.log('ℹ️ Ya existen usuarios registrados');
    }
  }

  //  Guardar datos de sesión
  async setSessionData(userData: any): Promise<void> {
    await this._storage?.set('session', userData);
    console.log('✅ Sesión guardada:', userData);
  }

  //  Obtener datos de sesión
  async getSessionData(): Promise<any> {
    const session = await this._storage?.get('session');
    console.log('📖 Sesión obtenida:', session);
    return session;
  }

  //  Verificar si hay sesión activa
  async hasActiveSession(): Promise<boolean> {
    const session = await this.getSessionData();
    return session !== null && session !== undefined;
  }

  //  Cerrar sesión
  async clearSession(): Promise<void> {
    await this._storage?.remove('session');
    console.log('🗑️ Sesión eliminada');
  }

  //  Guardar experiencia laboral
  async saveExperienciaLaboral(email: string, experiencias: any[]): Promise<void> {
    const key = `experiencia_${email}`;
    await this._storage?.set(key, experiencias);
    console.log(`✅ Experiencias guardadas para ${email}`);
  }

  //  Obtener experiencia laboral
  async getExperienciaLaboral(email: string): Promise<any[]> {
    const key = `experiencia_${email}`;
    const experiencias = await this._storage?.get(key) || [];
    return experiencias;
  }

  //  Guardar certificaciones
  async saveCertificaciones(email: string, certificaciones: any[]): Promise<void> {
    const key = `certificaciones_${email}`;
    await this._storage?.set(key, certificaciones);
    console.log(`✅ Certificaciones guardadas para ${email}`);
  }

  //  Obtener certificaciones
  async getCertificaciones(email: string): Promise<any[]> {
    const key = `certificaciones_${email}`;
    const certificaciones = await this._storage?.get(key) || [];
    return certificaciones;
  }

  //  Guardar usuario registrado
  async saveUser(email: string, password: string): Promise<void> {
    const users = await this.getUsers();
    const userExists = users.find(user => user.email === email);
    
    if (!userExists) {
      users.push({ email, password });
      await this._storage?.set('users', users);
      console.log('✅ Usuario registrado:', email);
    }
  }

  //  Obtener todos los usuarios
  async getUsers(): Promise<any[]> {
    const users = await this._storage?.get('users') || [];
    return users;
  }

  //  Validar usuario
  async validateUser(email: string, password: string): Promise<boolean> {
    const users = await this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    return user !== undefined;
  }

  //  NUEVO: Función para mostrar usuarios disponibles (solo para debug)
  async mostrarUsuariosDisponibles(): Promise<void> {
    const users = await this.getUsers();
    console.log('👥 Usuarios disponibles para login:');
    users.forEach(user => {
      console.log(`📧 ${user.email} - 🔑 ${user.password}`);
    });
  }

  //  Método genérico para guardar datos
  async set(key: string, value: any): Promise<void> {
    await this._storage?.set(key, value);
  }

  //  Método genérico para obtener datos
  async get(key: string): Promise<any> {
    return await this._storage?.get(key);
  }

  //  Limpiar todo el storage
  async clear(): Promise<void> {
    await this._storage?.clear();
    console.log('🗑️ Storage limpiado completamente');
  }
}
