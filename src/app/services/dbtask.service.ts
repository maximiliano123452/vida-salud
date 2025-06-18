import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

export interface SesionData {
  user_name: string;
  password: string;
  active: number; // 1 = activo, 0 = inactivo
}

@Injectable({
  providedIn: 'root',
})
export class DBTaskService {
  private sqlite: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;
  private dbName = 'vida_salud_db';

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  //  Función que setea un objeto SQLiteObject
  async setDatabase(): Promise<void> {
    if (Capacitor.getPlatform() === 'web') {
      await this.sqlite.initWebStore();
    }

    try {
      this.db = await this.sqlite.createConnection(
        this.dbName,
        false,
        'no-encryption',
        1,
        false
      );
      await this.db.open();
      console.log('✅ Base de datos conectada');
    } catch (error) {
      console.error('❌ Error al conectar base de datos:', error);
      throw error;
    }
  }

  //  Función que genere las tablas necesarias
  async crearTablas(): Promise<void> {
    if (!this.db) {
      await this.setDatabase();
    }

    const createSessionTable = `
      CREATE TABLE IF NOT EXISTS sesion_data (
        user_name TEXT PRIMARY KEY NOT NULL,
        password TEXT NOT NULL,
        active INTEGER NOT NULL DEFAULT 0
      );
    `;

    const createExperienciaTable = `
      CREATE TABLE IF NOT EXISTS experiencia_laboral (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_name TEXT NOT NULL,
        empresa TEXT NOT NULL,
        ano_inicio INTEGER NOT NULL,
        trabaja_actualmente INTEGER NOT NULL,
        ano_termino INTEGER,
        cargo TEXT NOT NULL,
        FOREIGN KEY (user_name) REFERENCES sesion_data(user_name)
      );
    `;

    const createCertificacionesTable = `
      CREATE TABLE IF NOT EXISTS certificaciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_name TEXT NOT NULL,
        nombre_certificado TEXT NOT NULL,
        fecha_obtencion TEXT NOT NULL,
        tiene_vencimiento INTEGER NOT NULL,
        fecha_vencimiento TEXT,
        FOREIGN KEY (user_name) REFERENCES sesion_data(user_name)
      );
    `;

    try {
      await this.db!.execute(createSessionTable);
      await this.db!.execute(createExperienciaTable);
      await this.db!.execute(createCertificacionesTable);
      console.log('✅ Tablas creadas exitosamente');
    } catch (error) {
      console.error('❌ Error al crear tablas:', error);
      throw error;
    }
  }

  //  Función que consulte si existe alguna sesión activa
  async consultarSesionActiva(): Promise<SesionData | null> {
    if (!this.db) {
      await this.setDatabase();
    }

    const query = 'SELECT * FROM sesion_data WHERE active = 1 LIMIT 1';
    
    try {
      const result = await this.db!.query(query);
      if (result.values && result.values.length > 0) {
        return result.values[0] as SesionData;
      }
      return null;
    } catch (error) {
      console.error('❌ Error al consultar sesión activa:', error);
      return null;
    }
  }

  //  Función que valide la existencia de un usuario que inicia sesión
  async validarUsuario(userName: string, password: string): Promise<boolean> {
    if (!this.db) {
      await this.setDatabase();
    }

    const query = 'SELECT * FROM sesion_data WHERE user_name = ? AND password = ?';
    
    try {
      const result = await this.db!.query(query, [userName, password]);
      return result.values ? result.values.length > 0 : false;
    } catch (error) {
      console.error('❌ Error al validar usuario:', error);
      return false;
    }
  }

  //  Función que permita el registro de una sesión
  async registrarSesion(userName: string, password: string): Promise<boolean> {
    if (!this.db) {
      await this.setDatabase();
    }

    // Primero verificar si el usuario ya existe
    const checkUser = 'SELECT * FROM sesion_data WHERE user_name = ?';
    
    try {
      const existingUser = await this.db!.query(checkUser, [userName]);
      
      if (existingUser.values && existingUser.values.length > 0) {
        console.log('⚠️ Usuario ya existe');
        return false;
      }

      // Registrar nuevo usuario
      const insertQuery = 'INSERT INTO sesion_data (user_name, password, active) VALUES (?, ?, 1)';
      await this.db!.run(insertQuery, [userName, password]);
      console.log('✅ Usuario registrado exitosamente');
      return true;
    } catch (error) {
      console.error('❌ Error al registrar sesión:', error);
      return false;
    }
  }

  //  Función que permita actualizar el estado de active de una sesión
  async actualizarEstadoSesion(userName: string, active: number): Promise<boolean> {
    if (!this.db) {
      await this.setDatabase();
    }

    const updateQuery = 'UPDATE sesion_data SET active = ? WHERE user_name = ?';
    
    try {
      await this.db!.run(updateQuery, [active, userName]);
      console.log(`✅ Estado de sesión actualizado: ${userName} -> ${active ? 'activo' : 'inactivo'}`);
      return true;
    } catch (error) {
      console.error('❌ Error al actualizar estado de sesión:', error);
      return false;
    }
  }

  //  Función para cerrar todas las sesiones activas
  async cerrarTodasLasSesiones(): Promise<void> {
    if (!this.db) {
      await this.setDatabase();
    }

    const updateQuery = 'UPDATE sesion_data SET active = 0 WHERE active = 1';
    
    try {
      await this.db!.run(updateQuery);
      console.log('✅ Todas las sesiones han sido cerradas');
    } catch (error) {
      console.error('❌ Error al cerrar sesiones:', error);
    }
  }

  //  Función para inicializar todo el sistema
  async inicializarSistema(): Promise<void> {
    try {
      await this.setDatabase();
      await this.crearTablas();
      console.log('✅ Sistema de base de datos inicializado completamente');
    } catch (error) {
      console.error('❌ Error al inicializar sistema:', error);
      throw error;
    }
  }
}