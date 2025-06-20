import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { DBTaskService } from '../../services/dbtask.service';

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
    private dbTaskService: DBTaskService
  ) {}

  async ngOnInit() {
    console.log('🚀 Inicializando login con SQLite...');
    
    try {
      // Inicializar SQLite
      await this.dbTaskService.inicializarSistema();
      console.log('✅ SQLite inicializado correctamente');
      
      // Crear usuarios de prueba
      await this.crearUsuariosDePrueba();
      
      // Verificar si hay sesión activa
      await this.verificarSesionActiva();
      
    } catch (error) {
      console.error('❌ Error al inicializar SQLite:', error);
    }
  }

  async crearUsuariosDePrueba() {
    console.log('🔧 Creando usuarios de prueba en SQLite...');
    
    const usuariosPrueba = [
      { user: 'admin@vidasana.com', pass: 'admin' },
      { user: 'marco@gmail.com', pass: '7890' },
      { user: 'usuario@gmail.com', pass: '123' },
      { user: 'test@test.com', pass: 'test' },
      { user: 'demo@demo.com', pass: 'demo' }
    ];

    for (const usuario of usuariosPrueba) {
      try {
        const registrado = await this.dbTaskService.registrarSesion(usuario.user, usuario.pass);
        if (registrado) {
          console.log(`✅ Usuario SQLite ${usuario.user} creado`);
        } else {
          console.log(`ℹ️ Usuario SQLite ${usuario.user} ya existe`);
        }
      } catch (error) {
        console.log(`ℹ️ Usuario SQLite ${usuario.user} ya existe o error:`, error);
      }
    }
  }

  async verificarSesionActiva() {
    try {
      const sesionActiva = await this.dbTaskService.consultarSesionActiva();
      
      if (sesionActiva) {
        console.log('✅ Sesión SQLite activa encontrada:', sesionActiva.user_name);
        
        const alert = await this.alertController.create({
          header: '🔄 Sesión Activa',
          message: `Sesión activa: ${sesionActiva.user_name}. ¿Continuar?`,
          buttons: [
            {
              text: 'Cerrar Sesión',
              handler: async () => {
                await this.dbTaskService.cerrarTodasLasSesiones();
                console.log('🚪 Sesión SQLite cerrada');
              }
            },
            {
              text: 'Continuar',
              handler: () => {
                this.navCtrl.navigateForward(['/home']);
              }
            }
          ]
        });
        await alert.present();
      }
    } catch (error) {
      console.error('❌ Error al verificar sesión SQLite:', error);
    }
  }

  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: '❌ Error',
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

  async mostrarUsuariosDePrueba() {
    let mensaje = '🔑 Usuarios SQLite disponibles:\n\n';
    mensaje += '📧 admin@vidasana.com - 🔑 admin\n';
    mensaje += '📧 marco@gmail.com - 🔑 7890\n';
    mensaje += '📧 usuario@gmail.com - 🔑 123\n';
    mensaje += '📧 test@test.com - 🔑 test\n';
    mensaje += '📧 demo@demo.com - 🔑 demo\n\n';
    mensaje += 'O registra una cuenta nueva (se guardará en SQLite).';

    const alert = await this.alertController.create({
      header: '👥 Usuarios SQLite',
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
    // Validaciones
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
      console.log('🔍 Intentando login con SQLite:', this.email);
      
      // Validar usuario en SQLite
      const isValidUser = await this.dbTaskService.validarUsuario(this.email, this.password);
      
      if (isValidUser) {
        // Cerrar otras sesiones y activar la nueva
        await this.dbTaskService.cerrarTodasLasSesiones();
        await this.dbTaskService.actualizarEstadoSesion(this.email, 1);
        
        await this.mostrarExito(`¡Bienvenido ${this.email}! (SQLite Login)`);
        
        // Navegar al home
        this.navCtrl.navigateForward(['/home'], {
          queryParams: {
            email: this.email,
            loginType: 'sqlite'
          }
        });
        
        console.log('✅ Login SQLite exitoso para:', this.email);
      } else {
        console.log('❌ Usuario no encontrado en SQLite:', this.email);
        
        const alert = await this.alertController.create({
          header: '❌ Credenciales incorrectas',
          message: 'Usuario no encontrado en SQLite. ¿Deseas ver los usuarios disponibles o registrarte?',
          buttons: [
            {
              text: 'Ver usuarios',
              handler: () => {
                this.mostrarUsuariosDePrueba();
              }
            },
            {
              text: 'Registrarse',
              handler: () => {
                this.registro();
              }
            },
            'Cancelar'
          ]
        });
        await alert.present();
      }
    } catch (error) {
      console.error('❌ Error en login SQLite:', error);
      this.mostrarAlerta('Error al iniciar sesión con SQLite. Verifica la conexión.');
    }
  }

  registro() {
    console.log('🔄 Navegando a registro (usará SQLite)');
    this.navCtrl.navigateForward(['/registro']);
  }
}