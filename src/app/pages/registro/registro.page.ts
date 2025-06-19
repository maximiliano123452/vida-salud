import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { FormtearFechaPipe } from '../../pipes/formtear-fecha.pipe';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false
})
export class RegistroPage implements OnInit {

  nombre: any = '';
  apellido: any = '';
  selectedOption: any = ''; // nivel de estudios
  selectedDate: any = '';
  usuario: any = ''; // email
  password: any = '';

  constructor(
    private alertController: AlertController,
    private menu: MenuController,
    private formtearFechaPipe: FormtearFechaPipe,
    private storageService: StorageService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.menu.close("mainMenu");
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Mensaje',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentSuccess(message: string) {
    const alert = await this.alertController.create({
      header: '✅ Registro Exitoso',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async guardar() {
    const fechaFormateada = this.formtearFechaPipe.transform(this.selectedDate);

    // Validaciones básicas
    if (this.nombre.trim() === '' || this.apellido.trim() === '') {
      this.presentAlert('❌ Error: nombre y apellido no pueden estar vacíos');
      return;
    }

    if (!this.usuario || this.usuario.trim() === '') {
      this.presentAlert('❌ Error: el email es obligatorio');
      return;
    }

    if (!this.validarEmail(this.usuario)) {
      this.presentAlert('❌ Error: el email no tiene un formato válido');
      return;
    }

    if (!this.password || this.password.trim() === '') {
      this.presentAlert('❌ Error: la contraseña es obligatoria');
      return;
    }

    if (this.password.length < 3 || this.password.length > 8) {
      this.presentAlert('❌ Error: la contraseña debe tener entre 3 y 8 caracteres');
      return;
    }

    try {
      //  Verificar si el usuario ya existe
      const users = await this.storageService.getUsers();
      const userExists = users.find(user => user.email === this.usuario);

      if (userExists) {
        this.presentAlert('❌ Error: Ya existe un usuario registrado con este email');
        return;
      }

      //  Guardar nuevo usuario
      await this.storageService.saveUser(this.usuario, this.password);

      //  Iniciar sesión automáticamente
      const userData = {
        email: this.usuario,
        loginTime: new Date().toISOString()
      };
      
      await this.storageService.setSessionData(userData);

      //  Mostrar mensaje de éxito
      await this.presentSuccess(
        `¡Usuario registrado exitosamente!\n\n` +
        `👤 Nombre: ${this.nombre} ${this.apellido}\n` +
        `📧 Email: ${this.usuario}\n` +
        `📅 Fecha nacimiento: ${fechaFormateada}\n` +
        `🎓 Nivel estudios: ${this.selectedOption}\n\n` +
        `Serás redirigido al home automáticamente.`
      );

      //  Navegar al home después del registro
      setTimeout(() => {
        this.navCtrl.navigateForward(['/home'], {
          queryParams: {
            email: this.usuario,
            password: this.password
          }
        });
      }, 2000);

      console.log('✅ Registro exitoso para:', this.usuario);

    } catch (error) {
      console.error('❌ Error en registro:', error);
      this.presentAlert('❌ Error al registrar usuario. Intenta nuevamente.');
    }
  }
}