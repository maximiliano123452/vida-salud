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
      nombre: 'Manzana',
      precio: 2.5,
      imagen: '/assets/img/productos/manzanas.jpg'
    },
    {
      nombre: 'Banana',
      precio: 1.2,
      imagen: '/assets/img/productos/bananas.jpeg'
    },
    {
      nombre: 'Naranja',
      precio: 3.0,
      imagen: '/assets/img/productos/naranjas.jpg'
    },
    {
      nombre: 'Piña',
      precio: 4.5,
      imagen: '/assets/img/productos/piña.jpg'
    },
    {
      nombre: 'Fresas',
      precio: 5.0,
      imagen: '/assets/img/productos/fresas.jpg'
    },
    {
      nombre: 'Kiwi',
      precio: 5.0,
      imagen: '/assets/img/productos/kiwi.jpg'
    },
    {
      nombre: 'Maracuya',
      precio: 5.0,
      imagen: '/assets/img/productos/maracuya.jpg'
    }
    // Agrega más frutas si es necesario
  ];

  constructor(private menu: MenuController) { }


  ngOnInit() {
        this.menu.close('mainMenu');
  }

}
