import { Component, Input, OnInit } from '@angular/core';

export interface ExperienciaLaboral {
  empresa: string;
  anoInicio: number;
  trabajaActualmente: boolean;
  anoTermino?: number;
  cargo: string;
}

@Component({
  selector: 'app-experiencia-laboral',
  templateUrl: './experiencia-laboral.component.html',
  styleUrls: ['./experiencia-laboral.component.scss'],
  standalone: false
})
export class ExperienciaLaboralComponent implements OnInit {
  
  @Input() email: string = '';
  
  // Datos del formulario
  experiencia: ExperienciaLaboral = {
    empresa: '',
    anoInicio: new Date().getFullYear(),
    trabajaActualmente: false,
    anoTermino: undefined,
    cargo: ''
  };

  // Lista de experiencias guardadas
  experiencias: ExperienciaLaboral[] = [];

  constructor() { }

  ngOnInit() {
    console.log('Componente Experiencia Laboral cargado para:', this.email);
    this.cargarExperiencias();
  }

  cargarExperiencias() {
    //  cargar desde SQLite o Storage
  
    this.experiencias = [];
  }

  agregarExperiencia() {
    if (this.validarFormulario()) {
      const nuevaExperiencia = { ...this.experiencia };
      this.experiencias.push(nuevaExperiencia);
      this.limpiarFormulario();
      console.log('Experiencia agregada:', nuevaExperiencia);
      // Aqui se guarda en SQLite
    }
  }

  validarFormulario(): boolean {
    if (!this.experiencia.empresa.trim()) {
      alert('Por favor ingresa el nombre de la empresa');
      return false;
    }
    if (!this.experiencia.cargo.trim()) {
      alert('Por favor ingresa el cargo');
      return false;
    }
    if (!this.experiencia.trabajaActualmente && !this.experiencia.anoTermino) {
      alert('Por favor ingresa el año de término');
      return false;
    }
    return true;
  }

  limpiarFormulario() {
    this.experiencia = {
      empresa: '',
      anoInicio: new Date().getFullYear(),
      trabajaActualmente: false,
      anoTermino: undefined,
      cargo: ''
    };
  }

  eliminarExperiencia(index: number) {
    this.experiencias.splice(index, 1);
  }

}