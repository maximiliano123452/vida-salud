import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recetas',
  templateUrl: './recetas.page.html',
  styleUrls: ['./recetas.page.scss'],
  standalone:false
})
export class RecetasPage implements OnInit {

   recetas = [
    {
      nombre: 'Smoothie de Fresa y Banana',
      descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      imagen: '/assets/img/recetas/receta1.jpg',
    },
    {
      nombre: 'Tarta de Manzana',
      descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      imagen: '/assets/img/recetas/receta2.jpg',
    }, 
    {
      nombre: 'Postre de Frutilla',
      descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      imagen: '/assets/img/recetas/receta3.jpg',
    }, 
    {
      nombre: 'Queque de Naranja',
      descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      imagen: '/assets/img/recetas/receta4.jpg',
    }, 
    {
      nombre: 'Torta de Kiwi',
      descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      imagen: '/assets/img/recetas/receta5.jpg',
    }, 
    {
      nombre: 'Chesscake de Maracuya',
      descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      imagen: '/assets/img/recetas/receta6.jpg',
    },
        {
      nombre: 'Mix de Frutas',
      descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      imagen: '/assets/img/recetas/receta7.jpg',
    }, 
    {
      nombre: 'Ensalada de Frutas Tropicales',
      descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      imagen: '/assets/img/recetas/receta8.jpg',
    }
    // Agrega más recetas hasta llegar a 10
  ];


  constructor() { }

  ngOnInit() {
  }

}
