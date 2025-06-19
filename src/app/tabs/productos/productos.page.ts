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
      precio: 3.5,
      imagen: '/assets/img/productos/nueces.jpg'
    },
    {
      nombre: 'Almendras',
      precio: 3.5,
      imagen: '/assets/img/productos/almendras.jpg'
    },
    {
      nombre: 'Avellanas',
      precio: 4.0,
      imagen: '/assets/img/productos/avellanas.jpg'
    },
    {
      nombre: 'Arándanos',
      precio: 5.5,
      imagen: '/assets/img/productos/arandanos.jpg'
    },
    {
      nombre: 'Maqui',
      precio: 8.0,
      imagen: '/assets/img/productos/maqui.jpg'
    },
    {
      nombre: 'Avena',
      precio: 3.5,
      imagen: '/assets/img/productos/avena.jpg'
    },
    {
      nombre: 'Quinoa',
      precio: 2.5,
      imagen: '/assets/img/productos/quinoa.jpg'
    }
  ];

  constructor(private menu: MenuController) { }

  ngOnInit() {
    this.menu.close('mainMenu');
  }

}

