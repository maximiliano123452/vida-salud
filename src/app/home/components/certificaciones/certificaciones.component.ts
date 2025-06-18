import { Component, Input, OnInit } from '@angular/core';

export interface Certificacion {
  nombreCertificado: string;
  fechaObtencion: string;
  tieneVencimiento: boolean;
  fechaVencimiento?: string;
}

@Component({
  selector: 'app-certificaciones',
  templateUrl: './certificaciones.component.html',
  styleUrls: ['./certificaciones.component.scss'],
  standalone: false
})
export class CertificacionesComponent implements OnInit {
  
  @Input() email: string = '';
  
  // Datos del formulario
  certificacion: Certificacion = {
    nombreCertificado: '',
    fechaObtencion: '',
    tieneVencimiento: false,
    fechaVencimiento: undefined
  };

  // Lista de certificaciones guardadas
  certificaciones: Certificacion[] = [];

  constructor() { }

  ngOnInit() {
    console.log('Componente Certificaciones cargado para:', this.email);
    this.cargarCertificaciones();
  }

  cargarCertificaciones() {
    // Aqui se carga desde SQLite o Storage
    
    this.certificaciones = [];
  }

  agregarCertificacion() {
    if (this.validarFormulario()) {
      const nuevaCertificacion = { ...this.certificacion };
      this.certificaciones.push(nuevaCertificacion);
      this.limpiarFormulario();
      console.log('Certificación agregada:', nuevaCertificacion);
      // Aqui se guarda en SQLite
    }
  }

  validarFormulario(): boolean {
    if (!this.certificacion.nombreCertificado.trim()) {
      alert('Por favor ingresa el nombre del certificado');
      return false;
    }
    if (!this.certificacion.fechaObtencion) {
      alert('Por favor selecciona la fecha de obtención');
      return false;
    }
    if (this.certificacion.tieneVencimiento && !this.certificacion.fechaVencimiento) {
      alert('Por favor selecciona la fecha de vencimiento');
      return false;
    }
    return true;
  }

  limpiarFormulario() {
    this.certificacion = {
      nombreCertificado: '',
      fechaObtencion: '',
      tieneVencimiento: false,
      fechaVencimiento: undefined
    };
  }

  eliminarCertificacion(index: number) {
    this.certificaciones.splice(index, 1);
  }

  // Función para verificar si un certificado está próximo a vencer
  estaProximoAVencer(certificacion: Certificacion): boolean {
    if (!certificacion.tieneVencimiento || !certificacion.fechaVencimiento) {
      return false;
    }
    
    const fechaVencimiento = new Date(certificacion.fechaVencimiento);
    const hoy = new Date();
    const diasParaVencer = Math.ceil((fechaVencimiento.getTime() - hoy.getTime()) / (1000 * 3600 * 24));
    
    return diasParaVencer <= 30 && diasParaVencer > 0;
  }

  // Función para verificar si un certificado está vencido
  estaVencido(certificacion: Certificacion): boolean {
    if (!certificacion.tieneVencimiento || !certificacion.fechaVencimiento) {
      return false;
    }
    
    const fechaVencimiento = new Date(certificacion.fechaVencimiento);
    const hoy = new Date();
    
    return fechaVencimiento < hoy;
  }

}
