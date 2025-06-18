import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.component.html',
  styleUrls: ['./mis-datos.component.scss'],
  standalone: false
})
export class MisDatosComponent implements OnInit {
  
  @Input() email: string = '';

  constructor() { }

  ngOnInit() {
    console.log('Componente Mis Datos cargado para:', this.email);
  }

}
