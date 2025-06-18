import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';  

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  standalone: false
})
export class ProductosPage implements OnInit {

  productos = [
    {
      nombre: 'Nueces',
      precio: 9.5,
      imagen: '/assets/img/productos/nueces.jpg'
    },
    {
      nombre: 'Almendras',
      precio: 11.2,
      imagen: '/assets/img/productos/almendras.jpg'
    },
    {
      nombre: 'Avellanas',
      precio: 12.3,
      imagen: '/assets/img/productos/avellanas.jpg'
    },
    {
      nombre: 'Arándanos',
      precio: 14.7,
      imagen: '/assets/img/productos/arandanos.jpg'
    },
    {
      nombre: 'Maqui',
      precio: 16.9,
      imagen: '/assets/img/productos/maqui.jpg'
    },
    {
      nombre: 'Avena',
      precio: 2.8,
      imagen: '/assets/img/productos/avena.jpg'
    },
    {
      nombre: 'Quinoa',
      precio: 4.6,
      imagen: '/assets/img/productos/quinoa.jpg'
    }
  ];

  constructor(private menu: MenuController) { }

  ngOnInit() {
    this.menu.close('mainMenu');
  }

}

