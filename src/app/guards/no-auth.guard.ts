import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  constructor(
    private storageService: StorageService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    try {
      console.log('🔓 NoAuthGuard: Verificando acceso público...');
      
      const hasSession = await this.storageService.hasActiveSession();
      
      if (hasSession) {
        console.log('ℹ️ NoAuthGuard: Hay sesión activa, redirigiendo al home');
        this.router.navigate(['/home']);
        return false;
      } else {
        console.log('✅ NoAuthGuard: Sin sesión, acceso permitido');
        return true;
      }
    } catch (error) {
      console.error('❌ NoAuthGuard: Error:', error);
      return true; // En caso de error, permitir acceso público
    }
  }
}