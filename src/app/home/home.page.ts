import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  email: string = '';
  password: string = '';
  bienvenidos: string = 'Bienvenid@';
  nombre: string = '';
  apellido: string = '';
  fotoPerfil: string = '';
  // segmentSelected: string = 'mis-datos';

  constructor(
    private route: ActivatedRoute,
    private menu: MenuController,
    private storageService: StorageService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      await this.menu.close("mainMenu");
      
      // Obtener parámetros de la ruta
      this.route.queryParams.subscribe(params => {
        this.email = params['email'] || '';
        this.password = params['password'] || '';
      });

      // Obtener datos de la sesión usando tu StorageService
      const session = await this.storageService.getSession();
      if (session) {
        this.nombre = session.nombre || '';
        this.apellido = session.apellido || '';
        this.fotoPerfil = session.fotoPerfil || '';
        this.email = session.email || this.email;
        console.log('✅ Datos del usuario cargados:', {
          nombre: this.nombre,
          apellido: this.apellido,
          email: this.email
        });
      } else {
        console.log('⚠️ No se encontró sesión activa');
        // Valores por defecto
        this.nombre = 'Usuario';
        this.apellido = '';
        this.fotoPerfil = '';
      }
    } catch (error) {
      console.error('❌ Error al cargar datos del usuario:', error);
      // Valores por defecto en caso de error
      this.nombre = 'Usuario';
      this.apellido = '';
      this.fotoPerfil = '';
    }
  }

  // onSegmentChanged(event: any) {
  //   this.segmentSelected = event.detail.value;
  //   console.log('Segment seleccionado:', this.segmentSelected);
  // }
}