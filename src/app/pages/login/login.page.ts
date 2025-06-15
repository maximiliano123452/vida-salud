import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage   {

  email: string = '';
  password: string = '';

  constructor(private navCtrl: NavController, private alertController: AlertController ) { }

   // Método para mostrar alerta de error
   async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }
// Función para validar el formato del email
   validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular básica para validar email
    return emailRegex.test(email);
  }

  login() {
    // Verificar que el campo de correo no esté vacío
    if (!this.email) {
     this.mostrarAlerta('El campo de correo no puede estar vacío.');
     return;
   }

   // Validar el formato del correo
  if (!this.validarEmail(this.email)) {
    this.mostrarAlerta('El formato del correo es inválido.');
    return;
  }

   // Verificar que la contraseña no esté vacía
   if (!this.password) {
    this.mostrarAlerta('El campo de contraseña no puede estar vacío.');
    return;
  }

    // Verificar que la contraseña tenga máximo 4 caracteres
    if ((this.password.length < 3) && (this.password.length > 8)) {
      this.mostrarAlerta('La contraseña debe tener 3 y 8 caracteres.');
      return;
    }


    
    // Si todas las validaciones son correctas, navega a la página "home"
  this.navCtrl.navigateForward(['/home'], {
    queryParams: {
      email: this.email,
      password: this.password
    }
  });
 
}

  registro()
  {
    this.navCtrl.navigateForward(['/registro']);
  }

}
 
