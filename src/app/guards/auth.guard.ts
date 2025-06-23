import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private storageService: StorageService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    try {
      console.log('🔐 AuthGuard: Verificando sesión...');
      
      const hasSession = await this.storageService.hasActiveSession();
      
      if (hasSession) {
        const session = await this.storageService.getSession();
        console.log('✅ AuthGuard: Sesión activa encontrada para:', session?.email);
        return true;
      } else {
        console.log('❌ AuthGuard: No hay sesión, redirigiendo al login');
        this.router.navigate(['/login']);
        return false;
      }
    } catch (error) {
      console.error('❌ AuthGuard: Error:', error);
      this.router.navigate(['/login']);
      return false;
    }
  }
}