import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
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
    private navCtrl: NavController, 
    private alertController: AlertController,
    private storageService: StorageService
  ) {}

  async ngOnInit() {
    //  NUEVO: Mostrar usuarios disponibles en consola para facilitar testing
    await this.storageService.mostrarUsuariosDisponibles();
  }

  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  async mostrarExito(mensaje: string) {
    const alert = await this.alertController.create({
      header: '✅ Éxito',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  //  NUEVO: Mostrar usuarios de prueba disponibles
  async mostrarUsuariosDePrueba() {
    const users = await this.storageService.getUsers();
    const usuariosPrueba = users.filter(u => 
      u.email.includes('admin') || 
      u.email.includes('test') || 
      u.email.includes('demo') || 
      u.email.includes('usuario')
    );

    let mensaje = '🔑 Usuarios de prueba disponibles:\n\n';
    usuariosPrueba.forEach(user => {
      mensaje += `📧 ${user.email}\n🔑 ${user.password}\n\n`;
    });
    
    mensaje += 'O puedes registrarte para crear tu propia cuenta.';

    const alert = await this.alertController.create({
      header: '👥 Usuarios de Prueba',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async login() {
    //  Validaciones
    if (!this.email || this.email.trim() === '') {
      this.mostrarAlerta('El correo no puede estar vacío.');
      return;
    }

    if (!this.validarEmail(this.email)) {
      this.mostrarAlerta('El correo no tiene un formato válido.');
      return;
    }

    if (!this.password || this.password.trim() === '') {
      this.mostrarAlerta('La contraseña no puede estar vacía.');
      return;
    }

    if (this.password.length < 3 || this.password.length > 8) {
      this.mostrarAlerta('La contraseña debe tener entre 3 y 8 caracteres.');
      return;
    }

    try {
      console.log('🔍 Intentando login con:', this.email);
      
      //  Validar usuario con StorageService
      const isValidUser = await this.storageService.validateUser(this.email, this.password);
      
      if (isValidUser) {
        //  Guardar sesión activa
        const userData = {
          email: this.email,
          loginTime: new Date().toISOString()
        };
        
        await this.storageService.setSessionData(userData);
        
        //  Mostrar mensaje de éxito
        await this.mostrarExito(`¡Bienvenido ${this.email}!`);
        
        //  Navegar al home
        this.navCtrl.navigateForward(['/home'], {
          queryParams: {
            email: this.email,
            password: this.password
          }
        });
        
        console.log('✅ Login exitoso para:', this.email);
      } else {
        //  Mostrar error con opción de ver usuarios de prueba
        const alert = await this.alertController.create({
          header: '❌ Credenciales incorrectas',
          message: 'Verifica tu email y contraseña.',
          buttons: [
            {
              text: 'Ver usuarios de prueba',
              handler: () => {
                this.mostrarUsuariosDePrueba();
              }
            },
            'OK'
          ]
        });
        await alert.present();
      }
    } catch (error) {
      console.error('❌ Error en login:', error);
      this.mostrarAlerta('Error al iniciar sesión. Intenta nuevamente.');
    }
  }

  registro() {
    this.navCtrl.navigateForward(['/registro']);
  }
}
