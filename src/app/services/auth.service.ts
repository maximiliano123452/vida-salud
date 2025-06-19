import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { DBTaskService } from './dbtask.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //  Observable para el estado de autenticación
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  //  Usuario actual
  private currentUserSubject = new BehaviorSubject<string>('');
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private dbtaskService: DBTaskService,
    private router: Router
  ) {
    this.checkAuthStatus();
  }

  //  Verificar estado de autenticación al iniciar
  async checkAuthStatus(): Promise<void> {
    try {
      const sesionActiva = await this.dbtaskService.consultarSesionActiva();
      if (sesionActiva) {
        this.isAuthenticatedSubject.next(true);
        this.currentUserSubject.next(sesionActiva.user_name);
        console.log('✅ AuthService: Usuario autenticado:', sesionActiva.user_name);
      } else {
        this.isAuthenticatedSubject.next(false);
        this.currentUserSubject.next('');
      }
    } catch (error) {
      console.error('❌ AuthService: Error al verificar estado:', error);
      this.isAuthenticatedSubject.next(false);
      this.currentUserSubject.next('');
    }
  }

  //  Función de login
  async login(userName: string, password: string): Promise<boolean> {
    try {
      const isValid = await this.dbtaskService.validarUsuario(userName, password);
      
      if (isValid) {
        // Cerrar otras sesiones y activar la actual
        await this.dbtaskService.cerrarTodasLasSesiones();
        await this.dbtaskService.actualizarEstadoSesion(userName, 1);
        
        // Actualizar estado
        this.isAuthenticatedSubject.next(true);
        this.currentUserSubject.next(userName);
        
        console.log('✅ AuthService: Login exitoso para:', userName);
        return true;
      } else {
        console.log('❌ AuthService: Credenciales inválidas');
        return false;
      }
    } catch (error) {
      console.error('❌ AuthService: Error en login:', error);
      return false;
    }
  }

  //  Función de registro
  async register(userName: string, password: string): Promise<boolean> {
    try {
      const success = await this.dbtaskService.registrarSesion(userName, password);
      
      if (success) {
        // Usuario registrado y ya está activo
        this.isAuthenticatedSubject.next(true);
        this.currentUserSubject.next(userName);
        
        console.log('✅ AuthService: Registro exitoso para:', userName);
        return true;
      } else {
        console.log('❌ AuthService: Error en registro (usuario puede existir)');
        return false;
      }
    } catch (error) {
      console.error('❌ AuthService: Error en registro:', error);
      return false;
    }
  }

  //  Función de logout
  async logout(): Promise<void> {
    try {
      const currentUser = this.currentUserSubject.value;
      
      if (currentUser) {
        await this.dbtaskService.actualizarEstadoSesion(currentUser, 0);
      }
      
      // Actualizar estado
      this.isAuthenticatedSubject.next(false);
      this.currentUserSubject.next('');
      
      // Navegar al login
      this.router.navigate(['/login']);
      
      console.log('✅ AuthService: Logout exitoso');
    } catch (error) {
      console.error('❌ AuthService: Error en logout:', error);
    }
  }

  //  Obtener usuario actual
  getCurrentUser(): string {
    return this.currentUserSubject.value;
  }

  //  Verificar si está autenticado
  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
