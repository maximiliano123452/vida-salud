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
      imagen: '/assets/img/productos/nueces.jpg',
      descripcion: 'Rica en omega-3, mejora la memoria y función cerebral.',
      beneficios: ['Memoria', 'Corazón', 'Antiinflamatorio']
    },
    {
      nombre: 'Almendras',
      precio: 3.5,
      imagen: '/assets/img/productos/almendras.jpg',
      descripcion: 'Vitamina E y magnesio. Fortalece huesos y corazón.',
      beneficios: ['Huesos', 'Corazón', 'Piel']
    },
    {
      nombre: 'Avellanas',
      precio: 4.0,
      imagen: '/assets/img/productos/avellanas.jpg',
      descripcion: 'Rica en grasas saludables y vitamina E. Mejora piel y cabello.',
      beneficios: ['Piel', 'Cabello', 'Corazón']
    },
    {
      nombre: 'Arándanos',
      precio: 5.5,
      imagen: '/assets/img/productos/arandanos.jpg',
      descripcion: 'Antioxidante natural. Mejora memoria y protege la vista.',
      beneficios: ['Antioxidante', 'Vista', 'Memoria']
    },
    {
      nombre: 'Maqui',
      precio: 8.0,
      imagen: '/assets/img/productos/maqui.jpg',
      descripcion: 'Súper antioxidante chileno. Combate el envejecimiento.',
      beneficios: ['Antienvejecimiento', 'Defensas', 'Energía']
    },
    {
      nombre: 'Avena',
      precio: 3.5,
      imagen: '/assets/img/productos/avena.jpg',
      descripcion: 'Fibra beta-glucano. Controla colesterol y azúcar en sangre.',
      beneficios: ['Colesterol', 'Digestión', 'Energía']
    },
    {
      nombre: 'Quinoa',
      precio: 2.5,
      imagen: '/assets/img/productos/quinoa.jpg',
      descripcion: 'Proteína completa, sin gluten, aminoácidos esenciales.',
      beneficios: ['Proteína', 'Sin gluten', 'Músculos']
    }
  ];

  constructor(private menu: MenuController) { }

  ngOnInit() {
    this.menu.close('mainMenu');
  }

}
