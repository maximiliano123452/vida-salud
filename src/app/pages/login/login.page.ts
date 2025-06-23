import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  
  email: string = '';
  password: string = '';
  
  constructor(
    private alertController: AlertController,
    private storageService: StorageService,
    private router: Router,
    private menu: MenuController
  ) {}
  
  ngOnInit() {
    this.menu.close("mainMenu");
  }
  
  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
  
  async login() {
    // Validación básica
    if (!this.email || !this.password) {
      this.presentAlert('❌ Por favor completa todos los campos');
      return;
    }
    
    const user = await this.storageService.validarCredenciales(this.email, this.password);
    
    if (!user) {
      this.presentAlert('❌ Credenciales incorrectas');
      return;
    }
    
    await this.storageService.setSession(user);
    
    const alert = await this.alertController.create({
      header: '✅ Bienvenido',
      message: `${user.nombre} ${user.apellido}`,
      buttons: ['OK']
    });
    await alert.present();
    
    this.router.navigate(['/home']);
  }
  
  // Método para navegar al registro
  registro() {
    this.router.navigate(['/registro']);
  }
}