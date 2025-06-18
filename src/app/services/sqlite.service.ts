import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root',
})
export class SqliteService {
  private sqlite: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  async initDatabase(): Promise<void> {
    if (Capacitor.getPlatform() === 'web') {
      await this.sqlite.initWebStore();
    }

    try {
      // ✅ Corregido: Agregado el 5to parámetro 'readonly' (false = lectura/escritura)
      this.db = await this.sqlite.createConnection(
        'vida_salud_db',    // database name
        false,              // encrypted
        'no-encryption',    // mode
        1,                  // version
        false               // readonly (false = lectura/escritura, true = solo lectura)
      );
      
      await this.db.open();

      // Crear tabla de ejemplo (puedes cambiar esto luego)
      const create = `
        CREATE TABLE IF NOT EXISTS datos_usuario (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT,
          email TEXT
        );
      `;
      await this.db.execute(create);

      console.log('✅ Base de datos lista');
    } catch (error) {
      console.error('❌ Error al inicializar la base de datos:', error);
    }
  }

  async insertarUsuario(nombre: string, email: string): Promise<void> {
    if (!this.db) {
      console.warn('⚠️ Base de datos no inicializada');
      return;
    }

    const insert = `INSERT INTO datos_usuario (nombre, email) VALUES (?, ?)`;
    try {
      await this.db.run(insert, [nombre, email]);
      console.log('✅ Usuario insertado');
    } catch (error) {
      console.error('❌ Error al insertar usuario:', error);
    }
  }

  async obtenerUsuarios(): Promise<any[]> {
    if (!this.db) {
      console.warn('⚠️ Base de datos no inicializada');
      return [];
    }

    const select = `SELECT * FROM datos_usuario`;
    try {
      const result = await this.db.query(select);
      return result.values || [];
    } catch (error) {
      console.error('❌ Error al obtener usuarios:', error);
      return [];
    }
  }

  // ✅ Método adicional para cerrar la conexión (buena práctica)
  async closeDatabase(): Promise<void> {
    if (this.db) {
      try {
        await this.db.close();
        this.db = null;
        console.log('✅ Base de datos cerrada');
      } catch (error) {
        console.error('❌ Error al cerrar la base de datos:', error);
      }
    }
  }
}
