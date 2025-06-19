import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService, DatoSalud, PresionArterial } from '../../services/api.service';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
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
  
  //  Formulario para nuevos datos
  nuevoDato: DatoSalud = {
    userId: 1,
    tipo: 'peso',
    valor: 75.5, // ⭐ Valor por defecto
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
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    console.log('✅ DatosSaludPage inicializada');
    
    //  NO cargar datos automáticamente al iniciar
    // Solo cargar cuando el usuario vaya a "Historial"
    
    //  REMOVIDO: La suscripción al loading del servicio
    // Esto causaba conflictos con el loading local
  }

  ngOnDestroy() {
    //  Cleanup de subscripciones
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  //  metodo para Detectar cambio de segmento
  onSegmentChange(event: any) {
    this.seccionActiva = event.detail.value;
    console.log('📍 Cambiando a sección:', this.seccionActiva);
    
    //  CARGAR DATOS AUTOMÁTICAMENTE AL IR A HISTORIAL
    if (this.seccionActiva === 'historial' && this.datosSalud.length === 0) {
      console.log('🔄 Cargando datos automáticamente...');
      this.cargarDatos();
    }
  }

  //  MÉTODO CORREGIDO: Cargar datos de la API
  async cargarDatos() {
    console.log('🔄 Iniciando carga de datos...');
    
    //  ESTABLECER LOADING ANTES DEL LOADING CONTROLLER
    this.loading = true;

    const loading = await this.loadingController.create({
      message: 'Cargando datos de salud...',
      duration: 10000 // Máximo 10 segundos
    });
    await loading.present();

    try {
      //  CREAR SUBSCRIPTION PARA MANEJAR CLEANUP
      const subscription = this.apiService.getDatosSalud(1).subscribe({
        next: (datos) => {
          console.log('✅ Datos recibidos de API:', datos);
          console.log('📊 Cantidad total:', datos.length);
          
          //  MOSTRAR TODOS LOS DATOS 
          this.datosSalud = datos; 
          
          //  DETENER LOADING EN AMBOS LUGARES
          this.loading = false;
          loading.dismiss();
          
          console.log('✅ Datos asignados a la lista:', this.datosSalud.length);
          this.mostrarToast(`${datos.length} registros cargados correctamente`, 'success');
        },
        error: (error) => {
          console.error('❌ Error al cargar datos:', error);
          
          //  DETENER LOADING EN CASO DE ERROR
          this.loading = false;
          loading.dismiss();
          
          this.mostrarToast('Error al cargar datos', 'danger');
        }
      });

      //  AGREGAR SUBSCRIPTION PARA CLEANUP
      this.subscriptions.push(subscription);

    } catch (error) {
      console.error('❌ Error en try-catch:', error);
      
      //  DETENER LOADING EN CATCH
      this.loading = false;
      loading.dismiss();
      
      this.mostrarToast('Error al conectar con el servidor', 'danger');
    }
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

    try {
      const subscription = this.apiService.crearDatoSalud(this.nuevoDato).subscribe({
        next: (resultado) => {
          console.log('✅ Dato creado:', resultado);
          
          // Agregar el nuevo dato a la lista local AL TOPE
          const nuevoItem = {
            id: resultado.id,
            title: `${this.nuevoDato.tipo}: ${this.nuevoDato.valor}`,
            body: `Fecha: ${this.nuevoDato.fecha}. Notas: ${this.nuevoDato.notas}`,
            userId: this.nuevoDato.userId
          };
          this.datosSalud.unshift(nuevoItem);
          
          this.limpiarFormulario();
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

  //  PUT: Actualizar dato existente
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
          
          // Actualizar en la lista local
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

  //  DELETE: Eliminar dato
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
          
          // Remover de la lista local INMEDIATAMENTE
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

  //  POST: Registrar presión arterial
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

  //  Funciones auxiliares
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

  //  MÉTODO DE DEBUG: Para verificar estado
  mostrarEstado() {
    console.log('📊 Estado actual:');
    console.log('- Datos cargados:', this.datosSalud.length);
    console.log('- Loading:', this.loading);
    console.log('- Sección activa:', this.seccionActiva);
    console.log('- Primeros 3 datos:', this.datosSalud.slice(0, 3));
  }

}