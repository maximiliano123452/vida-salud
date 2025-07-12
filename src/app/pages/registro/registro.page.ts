import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController, NavController } from '@ionic/angular';
import { StorageService } from '../../services/storage.service';
import { FormtearFechaPipe } from '../../pipes/formtear-fecha.pipe';
import { CameraService } from '../../services/camera.service'; // 📸 Importa tu servicio de cámara

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false
})
export class RegistroPage implements OnInit {
  
  nombre: string = '';
  apellido: string = '';
  selectedOption: string = '';
  selectedDate: any = '';
  email: string = '';  
  password: string = '';

  // 📸 FOTO DE PERFIL
  fotoPerfil: string | null = null;
  mostrarPreviewFotoPerfil = false;
  
  constructor(
    private alertController: AlertController,
    private menu: MenuController,
    private navCtrl: NavController,
    private storageService: StorageService,
    private formtearFechaPipe: FormtearFechaPipe,
    private cameraService: CameraService // ✅ Inyecta el servicio aquí
  ) {}
  
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
  
  validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  async guardar() {
    const fechaFormateada = this.formtearFechaPipe.transform(this.selectedDate);
    
    // Validación de campos obligatorios
    if (!this.nombre || !this.apellido || !this.email || !this.password) {
      this.presentAlert('❌ Todos los campos son obligatorios');
      return;
    }
    
    // Validación de email
    if (!this.validarEmail(this.email)) {
      this.presentAlert('❌ Correo electrónico no válido');
      return;
    }
    
    // Validación de contraseña
    if (this.password.length < 3 || this.password.length > 8) {
      this.presentAlert('❌ La contraseña debe tener entre 3 y 8 caracteres');
      return;
    }
    
    // Verificar si el usuario ya existe
    const existe = await this.storageService.existeUsuario(this.email);
    if (existe) {
      this.presentAlert('❌ Este correo ya está registrado');
      return;
    }
    
    // Crear objeto usuario
    const usuarioData = {
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,  
      password: this.password,
      fechaNacimiento: fechaFormateada,
      nivel: this.selectedOption,
      fotoPerfil: this.fotoPerfil // 📸 Agrega la foto de perfil si existe
    };
    
    try {
      // Guardar usuario y establecer sesión
      await this.storageService.guardarUsuario(usuarioData);
      await this.storageService.setSession(usuarioData);
      
      const success = await this.alertController.create({
        header: '✅ Registro exitoso',
        message: 'Serás redirigido al Home.',
        buttons: ['OK']
      });
      await success.present();
      
      // Limpiar formulario
      this.limpiarFormulario();
      
      // Navegar al home
      this.navCtrl.navigateForward('/home');
      
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      this.presentAlert('❌ Error al registrar usuario. Intenta nuevamente.');
    }
  }
  
  // Método para limpiar el formulario
  limpiarFormulario() {
    this.nombre = '';
    this.apellido = '';
    this.selectedOption = '';
    this.selectedDate = '';
    this.email = '';
    this.password = '';
    this.fotoPerfil = null; // limpia foto de perfil
  }
  
  // Método para volver al login
  volverLogin() {
    this.navCtrl.navigateBack('/login');
  }

  // 📸 MÉTODOS DE FOTO DE PERFIL

  async mostrarOpcionesCamara() {
    const foto = await this.cameraService.tomarFoto();
    if (foto) {
      this.fotoPerfil = foto;
      this.mostrarPreviewFotoPerfil = true;
      console.log('📸 Foto de perfil guardada');
    } else {
      console.log('❌ No se tomó foto de perfil');
    }
  }

  eliminarFotoPerfil() {
    this.fotoPerfil = null;
    this.mostrarPreviewFotoPerfil = false;
  }

  togglePreviewFotoPerfil() {
    this.mostrarPreviewFotoPerfil = !this.mostrarPreviewFotoPerfil;
  }

}
