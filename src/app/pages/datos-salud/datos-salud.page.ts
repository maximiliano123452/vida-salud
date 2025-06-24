import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService, DatoSalud, PresionArterial } from '../../services/api.service';
import { CameraService } from '../../services/camera.service'; // NUEVO IMPORT
import { AlertController, LoadingController, ToastController, ActionSheetController } from '@ionic/angular'; // AGREGADO ActionSheetController
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-datos-salud',
  templateUrl: './datos-salud.page.html',
  styleUrls: ['./datos-salud.page.scss'],
  standalone: false
})
export class DatosSaludPage implements OnInit, OnDestroy {

  //  Datos y estado
  datosSalud: any[] = [];
  loading = false;
  
  //  Control de segments
  seccionActiva = 'datos';
  
  // almacenar fotos
  fotoTomada: string | null = null;
  mostrarPreviewFoto = false;
  
  //  Formulario para nuevos datos
  nuevoDato: DatoSalud = {
    userId: 1,
    tipo: 'peso',
    valor: 75.5,
    fecha: new Date().toISOString().split('T')[0],
    notas: 'Dato de prueba'
  };

  //  Formulario para presión arterial
  nuevaPresion: PresionArterial = {
    userId: 1,
    sistolica: 120,
    diastolica: 80,
    fecha: new Date().toISOString().split('T')[0],
    notas: 'Medición en reposo'
  };

  //  Modo de edición
  editandoId: number | null = null;
  datoEditando: any = null;

  //  Subscripciones para cleanup
  private subscriptions: Subscription[] = [];

  constructor(
    private apiService: ApiService,
    private cameraService: CameraService, // servicio nuevo para la camara 
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private actionSheetController: ActionSheetController // CONTROLLER (nuevo)
  ) { }

  ngOnInit() {
    console.log('✅ DatosSaludPage inicializada');
    // Verificar disponibilidad de cámara
    this.verificarCamara();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // Verificar disponibilidad de cámara
  verificarCamara() {
    const disponible = this.cameraService.isCameraAvailable();
    const deviceInfo = this.cameraService.getDeviceInfo();
    
    console.log('📸 Estado de la cámara:', {
      disponible,
      platform: deviceInfo.platform,
      isMobile: deviceInfo.isMobile
    });
  }

  // MÉTODO: Mostrar opciones de cámara
  async mostrarOpcionesCamara() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Agregar Foto 📸',
      subHeader: 'Adjunta una imagen a tu registro de salud',
      buttons: [
        {
          text: 'Tomar Foto 📷',
          icon: 'camera',
          handler: () => {
            this.tomarFoto();
          }
        },
        {
          text: 'Seleccionar de Galería 🖼️',
          icon: 'images',
          handler: () => {
            this.seleccionarDeGaleria();
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('❌ Cancelado por usuario');
          }
        }
      ]
    });
    await actionSheet.present();
  }

  // MÉTODO: Tomar foto
  async tomarFoto() {
    const loading = await this.loadingController.create({
      message: 'Abriendo cámara...',
      duration: 5000
    });
    await loading.present();

    try {
      console.log('📸 Iniciando captura de foto...');
      const foto = await this.cameraService.tomarFoto();
      
      loading.dismiss();
      
      if (foto) {
        this.fotoTomada = foto;
        this.mostrarPreviewFoto = true;
        this.mostrarToast('✅ Foto capturada exitosamente', 'success');
        console.log('📸 Foto guardada en memoria');
      } else {
        this.mostrarToast('❌ No se pudo tomar la foto', 'warning');
        console.log('❌ Foto no capturada');
      }
      
    } catch (error) {
      console.error('❌ Error al tomar foto:', error);
      loading.dismiss();
      this.mostrarToast('Error al acceder a la cámara', 'danger');
    }
  }

  // MÉTODO: Seleccionar de galería
  async seleccionarDeGaleria() {
    const loading = await this.loadingController.create({
      message: 'Abriendo galería...',
      duration: 5000
    });
    await loading.present();

    try {
      console.log('🖼️ Iniciando selección de galería...');
      const foto = await this.cameraService.seleccionarFoto();
      
      loading.dismiss();
      
      if (foto) {
        this.fotoTomada = foto;
        this.mostrarPreviewFoto = true;
        this.mostrarToast('✅ Foto seleccionada exitosamente', 'success');
        console.log('🖼️ Foto seleccionada de galería');
      } else {
        this.mostrarToast('❌ No se seleccionó ninguna foto', 'warning');
        console.log('❌ No se seleccionó foto');
      }
      
    } catch (error) {
      console.error('❌ Error al seleccionar foto:', error);
      loading.dismiss();
      this.mostrarToast('Error al acceder a la galería', 'danger');
    }
  }

  // MÉTODO: Eliminar foto
  eliminarFoto() {
    this.fotoTomada = null;
    this.mostrarPreviewFoto = false;
    this.mostrarToast('📸 Foto eliminada', 'medium');
    console.log('🗑️ Foto eliminada');
  }

  // MÉTODO: Toggle preview de foto
  togglePreviewFoto() {
    this.mostrarPreviewFoto = !this.mostrarPreviewFoto;
  }

  //  Método para detectar cambio de segmento
  onSegmentChange(event: any) {
    this.seccionActiva = event.detail.value;
    console.log('📍 Cambiando a sección:', this.seccionActiva);
    
    if (this.seccionActiva === 'historial' && this.datosSalud.length === 0) {
      console.log('🔄 Cargando datos automáticamente...');
      this.cargarDatos();
    }
  }

  //  Cargar datos de la API (CON MANEJO OFFLINE)
  async cargarDatos() {
    console.log('🔄 Iniciando carga de datos...');
    
    this.loading = true;

    const loading = await this.loadingController.create({
      message: 'Cargando datos de salud...',
      duration: 10000
    });
    await loading.present();

    try {
      const subscription = this.apiService.getDatosSalud(1).subscribe({
        next: (datos) => {
          console.log('✅ Datos recibidos de API:', datos);
          this.datosSalud = datos; 
          this.loading = false;
          loading.dismiss();
          this.mostrarToast(`${datos.length} registros cargados correctamente`, 'success');
        },
        error: (error) => {
          console.error('❌ Error al cargar datos:', error);
          this.loading = false;
          loading.dismiss();
          
          // MANEJO OFFLINE - cargar datos locales
          this.cargarDatosOffline();
        }
      });

      this.subscriptions.push(subscription);

    } catch (error) {
      console.error('❌ Error en try-catch:', error);
      this.loading = false;
      loading.dismiss();
      
      // MANEJO OFFLINE
      this.cargarDatosOffline();
    }
  }

  // MÉTODO: Cargar datos offline (desde el servicio)
  cargarDatosOffline() {
    console.log('📱 Cargando datos offline...');
    
    // Usar datos locales del servicio API
    const datosLocales = this.apiService.getDatosSaludLocal();
    
    // Convertir a formato de la API para mostrar
    this.datosSalud = datosLocales.map(dato => ({
      id: dato.id,
      title: `${dato.tipo}: ${dato.valor}`,
      body: `Fecha: ${dato.fecha}. Notas: ${dato.notas}`,
      userId: dato.userId
    }));
    
    this.mostrarToast('📱 Mostrando datos guardados localmente', 'warning');
    console.log('✅ Datos offline cargados:', this.datosSalud.length);
  }

  //  POST: Crear nuevo dato de salud
  async crearDato() {
    if (!this.validarNuevoDato()) {
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Guardando dato...'
    });
    await loading.present();

    // Incluir información de foto en las notas
    let notasConFoto = this.nuevoDato.notas || '';
    if (this.fotoTomada) {
      notasConFoto += ' [📸 Incluye foto adjunta]';
    }

    const datoConFoto = {
      ...this.nuevoDato,
      notas: notasConFoto
    };

    try {
      const subscription = this.apiService.crearDatoSalud(datoConFoto).subscribe({
        next: (resultado) => {
          console.log('✅ Dato creado:', resultado);
          
          const nuevoItem = {
            id: resultado.id,
            title: `${this.nuevoDato.tipo}: ${this.nuevoDato.valor}`,
            body: `Fecha: ${this.nuevoDato.fecha}. Notas: ${notasConFoto}`,
            userId: this.nuevoDato.userId,
            foto: this.fotoTomada // Guardar foto localmente
          };
          this.datosSalud.unshift(nuevoItem);
          
          this.limpiarFormulario();
          this.eliminarFoto(); // Limpiar foto
          loading.dismiss();
          this.mostrarToast('✅ Dato guardado exitosamente', 'success');
        },
        error: (error) => {
          console.error('❌ Error al crear dato:', error);
          loading.dismiss();
          this.mostrarToast('Error al guardar dato', 'danger');
        }
      });

      this.subscriptions.push(subscription);

    } catch (error) {
      loading.dismiss();
      this.mostrarToast('Error al conectar con el servidor', 'danger');
    }
  }

  //  MÉTODOS EXISTENTES 
  async actualizarDato() {
    if (!this.datoEditando || !this.editandoId) return;

    const loading = await this.loadingController.create({
      message: 'Actualizando dato...'
    });
    await loading.present();

    const datoActualizado: DatoSalud = {
      userId: 1,
      tipo: 'peso',
      valor: parseFloat(this.datoEditando.valor),
      fecha: this.datoEditando.fecha,
      notas: this.datoEditando.notas || ''
    };

    try {
      const subscription = this.apiService.actualizarDatoSalud(this.editandoId, datoActualizado).subscribe({
        next: (resultado) => {
          console.log('✅ Dato actualizado:', resultado);
          
          const index = this.datosSalud.findIndex(d => d.id === this.editandoId);
          if (index !== -1) {
            this.datosSalud[index] = {
              ...this.datosSalud[index],
              title: `Actualizado: ${datoActualizado.valor}`,
              body: `Fecha: ${datoActualizado.fecha}. Notas: ${datoActualizado.notas}`
            };
          }
          
          this.cancelarEdicion();
          loading.dismiss();
          this.mostrarToast('✅ Dato actualizado exitosamente', 'success');
        },
        error: (error) => {
          console.error('❌ Error al actualizar:', error);
          loading.dismiss();
          this.mostrarToast('Error al actualizar dato', 'danger');
        }
      });

      this.subscriptions.push(subscription);

    } catch (error) {
      loading.dismiss();
      this.mostrarToast('Error al conectar con el servidor', 'danger');
    }
  }

  async eliminarDato(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este dato?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.confirmarEliminacion(id);
          }
        }
      ]
    });
    await alert.present();
  }

  async confirmarEliminacion(id: number) {
    const loading = await this.loadingController.create({
      message: 'Eliminando dato...'
    });
    await loading.present();

    try {
      const subscription = this.apiService.eliminarDatoSalud(id).subscribe({
        next: () => {
          console.log('✅ Dato eliminado:', id);
          this.datosSalud = this.datosSalud.filter(d => d.id !== id);
          loading.dismiss();
          this.mostrarToast('✅ Dato eliminado exitosamente', 'success');
        },
        error: (error) => {
          console.error('❌ Error al eliminar:', error);
          loading.dismiss();
          this.mostrarToast('Error al eliminar dato', 'danger');
        }
      });

      this.subscriptions.push(subscription);

    } catch (error) {
      loading.dismiss();
      this.mostrarToast('Error al conectar con el servidor', 'danger');
    }
  }

  async registrarPresion() {
    if (!this.validarPresion()) {
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Registrando presión arterial...'
    });
    await loading.present();

    try {
      const subscription = this.apiService.registrarPresionArterial(this.nuevaPresion).subscribe({
        next: (resultado) => {
          console.log('✅ Presión registrada:', resultado);
          
          const nuevoItem = {
            id: resultado.id,
            title: `Presión: ${this.nuevaPresion.sistolica}/${this.nuevaPresion.diastolica}`,
            body: `Fecha: ${this.nuevaPresion.fecha}. Notas: ${this.nuevaPresion.notas}`,
            userId: this.nuevaPresion.userId
          };
          this.datosSalud.unshift(nuevoItem);
          
          this.limpiarFormularioPresion();
          loading.dismiss();
          this.mostrarToast('✅ Presión arterial registrada', 'success');
        },
        error: (error) => {
          console.error('❌ Error al registrar presión:', error);
          loading.dismiss();
          this.mostrarToast('Error al registrar presión', 'danger');
        }
      });

      this.subscriptions.push(subscription);

    } catch (error) {
      loading.dismiss();
      this.mostrarToast('Error al conectar con el servidor', 'danger');
    }
  }

  // Funciones auxiliares
  iniciarEdicion(dato: any) {
    this.editandoId = dato.id;
    this.datoEditando = {
      valor: '',
      fecha: new Date().toISOString().split('T')[0],
      notas: ''
    };
  }

  cancelarEdicion() {
    this.editandoId = null;
    this.datoEditando = null;
  }

  validarNuevoDato(): boolean {
    if (!this.nuevoDato.valor || this.nuevoDato.valor <= 0) {
      this.mostrarToast('Ingresa un valor válido mayor a 0', 'warning');
      return false;
    }
    return true;
  }

  validarPresion(): boolean {
    if (this.nuevaPresion.sistolica < 70 || this.nuevaPresion.sistolica > 200) {
      this.mostrarToast('Presión sistólica debe estar entre 70 y 200', 'warning');
      return false;
    }
    if (this.nuevaPresion.diastolica < 40 || this.nuevaPresion.diastolica > 120) {
      this.mostrarToast('Presión diastólica debe estar entre 40 y 120', 'warning');
      return false;
    }
    return true;
  }

  limpiarFormulario() {
    this.nuevoDato = {
      userId: 1,
      tipo: 'peso',
      valor: 0,
      fecha: new Date().toISOString().split('T')[0],
      notas: ''
    };
  }

  limpiarFormularioPresion() {
    this.nuevaPresion = {
      userId: 1,
      sistolica: 120,
      diastolica: 80,
      fecha: new Date().toISOString().split('T')[0],
      notas: ''
    };
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: color,
      position: 'bottom'
    });
    toast.present();
  }

  mostrarEstado() {
    console.log('📊 Estado actual:');
    console.log('- Datos cargados:', this.datosSalud.length);
    console.log('- Loading:', this.loading);
    console.log('- Sección activa:', this.seccionActiva);
    console.log('- Foto tomada:', !!this.fotoTomada);
    console.log('- Preview foto:', this.mostrarPreviewFoto);
    console.log('- Primeros 3 datos:', this.datosSalud.slice(0, 3));
  }
}