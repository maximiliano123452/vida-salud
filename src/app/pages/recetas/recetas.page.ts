import { Component, OnInit, OnDestroy } from '@angular/core';
import { MealsService, Category, RecetaSimple, Meal } from '../../services/meals.service';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recetas',
  templateUrl: './recetas.page.html',
  styleUrls: ['./recetas.page.scss'],
  standalone: false
})
export class RecetasPage implements OnInit, OnDestroy {

  // Datos
  categorias: Category[] = [];
  recetas: RecetaSimple[] = [];
  recetaDelDia: Meal | null = null;
  
  // Estados
  loading = false;
  seccionActiva = 'categorias';
  categoriaSeleccionada = '';
  terminoBusqueda = '';
  
  // Subscripciones
  private subscriptions: Subscription[] = [];

  constructor(
    private mealsService: MealsService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    console.log('✅ RecetasPage inicializada');
    this.cargarCategorias();
    this.cargarRecetaDelDia();
  }

  ngOnDestroy() {
    // Limpiar subscripciones
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // Cambiar sección activa
  onSegmentChange(event: any) {
    this.seccionActiva = event.detail.value;
    console.log('📍 Cambiando a sección:', this.seccionActiva);
    
    if (this.seccionActiva === 'buscar') {
      // Limpiar búsqueda anterior
      this.terminoBusqueda = '';
      this.recetas = [];
    }
  }

  // 1. CARGAR CATEGORÍAS
  async cargarCategorias() {
    const loading = await this.loadingController.create({
      message: 'Cargando categorías...'
    });
    await loading.present();

    try {
      const subscription = this.mealsService.getCategorias().subscribe({
        next: (categorias) => {
          this.categorias = categorias;
          loading.dismiss();
          console.log('✅ Categorías cargadas:', this.categorias.length);
          
          if (categorias.length > 0) {
            this.mostrarToast(`${categorias.length} categorías disponibles`, 'success');
          }
        },
        error: (error) => {
          console.error('❌ Error al cargar categorías:', error);
          loading.dismiss();
          this.mostrarToast('Error al cargar categorías - mostrando datos offline', 'warning');
          
          // Cargar datos offline
          const datosOffline = this.mealsService.getDatosOffline();
          this.categorias = datosOffline.categorias;
        }
      });

      this.subscriptions.push(subscription);

    } catch (error) {
      loading.dismiss();
      this.mostrarToast('Error de conexión', 'danger');
    }
  }

  // 2. CARGAR RECETAS POR CATEGORÍA
  async cargarRecetasPorCategoria(categoria: string) {
    this.categoriaSeleccionada = categoria;
    this.seccionActiva = 'recetas';
    
    const loading = await this.loadingController.create({
      message: `Cargando recetas de ${categoria}...`
    });
    await loading.present();

    try {
      const subscription = this.mealsService.getRecetasPorCategoria(categoria).subscribe({
        next: (recetas) => {
          this.recetas = recetas;
          loading.dismiss();
          console.log(`✅ Recetas de ${categoria} cargadas:`, this.recetas.length);
          
          if (recetas.length > 0) {
            this.mostrarToast(`${recetas.length} recetas de ${categoria}`, 'success');
          } else {
            this.mostrarToast('No se encontraron recetas', 'warning');
          }
        },
        error: (error) => {
          console.error('❌ Error al cargar recetas:', error);
          loading.dismiss();
          this.mostrarToast('Error al cargar recetas', 'danger');
        }
      });

      this.subscriptions.push(subscription);

    } catch (error) {
      loading.dismiss();
      this.mostrarToast('Error de conexión', 'danger');
    }
  }

  // 3. BUSCAR RECETAS
  async buscarRecetas() {
    if (!this.terminoBusqueda || this.terminoBusqueda.trim().length < 2) {
      this.mostrarToast('Ingresa al menos 2 caracteres para buscar', 'warning');
      return;
    }

    const loading = await this.loadingController.create({
      message: `Buscando "${this.terminoBusqueda}"...`
    });
    await loading.present();

    try {
      const subscription = this.mealsService.buscarRecetas(this.terminoBusqueda.trim()).subscribe({
        next: (recetas) => {
          this.recetas = recetas;
          loading.dismiss();
          console.log(`✅ Búsqueda "${this.terminoBusqueda}" encontró:`, this.recetas.length);
          
          if (recetas.length > 0) {
            this.mostrarToast(`${recetas.length} recetas encontradas`, 'success');
          } else {
            this.mostrarToast('No se encontraron recetas con ese nombre', 'warning');
          }
        },
        error: (error) => {
          console.error('❌ Error en búsqueda:', error);
          loading.dismiss();
          this.mostrarToast('Error en la búsqueda', 'danger');
        }
      });

      this.subscriptions.push(subscription);

    } catch (error) {
      loading.dismiss();
      this.mostrarToast('Error de conexión', 'danger');
    }
  }

  // 4. CARGAR RECETA DEL DÍA
  async cargarRecetaDelDia() {
    try {
      const subscription = this.mealsService.getRecetaAleatoria().subscribe({
        next: (receta) => {
          this.recetaDelDia = receta;
          console.log('✅ Receta del día cargada:', receta?.strMeal);
        },
        error: (error) => {
          console.error('❌ Error al cargar receta del día:', error);
        }
      });

      this.subscriptions.push(subscription);

    } catch (error) {
      console.error('❌ Error al cargar receta del día:', error);
    }
  }

  // 5. VER DETALLE DE RECETA
  async verDetalleReceta(receta: RecetaSimple) {
    const loading = await this.loadingController.create({
      message: 'Cargando detalle...'
    });
    await loading.present();

    try {
      const subscription = this.mealsService.getDetalleReceta(receta.id).subscribe({
        next: async (detalleCompleto) => {
          loading.dismiss();
          
          if (detalleCompleto) {
            await this.mostrarDetalleModal(detalleCompleto);
          } else {
            this.mostrarToast('No se pudo cargar el detalle', 'warning');
          }
        },
        error: (error) => {
          console.error('❌ Error al cargar detalle:', error);
          loading.dismiss();
          this.mostrarToast('Error al cargar detalle', 'danger');
        }
      });

      this.subscriptions.push(subscription);

    } catch (error) {
      loading.dismiss();
      this.mostrarToast('Error de conexión', 'danger');
    }
  }

  // 6. MOSTRAR MODAL CON DETALLE
  async mostrarDetalleModal(receta: Meal) {
    const ingredientes = this.mealsService.extraerIngredientes(receta);
    
    const alert = await this.alertController.create({
      header: receta.strMeal,
      subHeader: `${receta.strCategory} • ${receta.strArea}`,
      message: `
        <div style="text-align: left;">
          <p><strong>Ingredientes:</strong></p>
          <ul style="margin: 8px 0; padding-left: 16px;">
            ${ingredientes.slice(0, 8).map(ing => `<li style="margin: 4px 0;">${ing}</li>`).join('')}
            ${ingredientes.length > 8 ? '<li>...y más</li>' : ''}
          </ul>
          <p><strong>Instrucciones:</strong></p>
          <p style="margin: 8px 0;">${receta.strInstructions.substring(0, 300)}...</p>
        </div>
      `,
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        },
        {
          text: 'Ver en YouTube',
          handler: () => {
            if (receta.strYoutube) {
              window.open(receta.strYoutube, '_blank');
            } else {
              this.mostrarToast('No hay video disponible', 'warning');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  // 7. VOLVER A CATEGORÍAS
  volverACategorias() {
    this.seccionActiva = 'categorias';
    this.recetas = [];
    this.categoriaSeleccionada = '';
  }

  // 8. LIMPIAR BÚSQUEDA
  limpiarBusqueda() {
    this.terminoBusqueda = '';
    this.recetas = [];
  }

  // 9. CARGAR RECETAS SALUDABLES
  async cargarRecetasSaludables() {
    const loading = await this.loadingController.create({
      message: 'Cargando recetas saludables...'
    });
    await loading.present();

    try {
      const subscription = this.mealsService.getRecetasSaludables().subscribe({
        next: (recetas) => {
          this.recetas = recetas;
          this.seccionActiva = 'recetas';
          this.categoriaSeleccionada = 'Recetas Saludables';
          loading.dismiss();
          this.mostrarToast(`${recetas.length} recetas saludables cargadas`, 'success');
        },
        error: (error) => {
          console.error('❌ Error al cargar recetas saludables:', error);
          loading.dismiss();
          this.mostrarToast('Error al cargar recetas saludables', 'danger');
        }
      });

      this.subscriptions.push(subscription);

    } catch (error) {
      loading.dismiss();
      this.mostrarToast('Error de conexión', 'danger');
    }
  }

  // Utilidades
  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: color,
      position: 'bottom'
    });
    toast.present();
  }

  // Debug
  mostrarEstado() {
    console.log('📊 Estado RecetasPage:');
    console.log('- Sección activa:', this.seccionActiva);
    console.log('- Categorías:', this.categorias.length);
    console.log('- Recetas:', this.recetas.length);
    console.log('- Categoría seleccionada:', this.categoriaSeleccionada);
    console.log('- Término búsqueda:', this.terminoBusqueda);
  }
}