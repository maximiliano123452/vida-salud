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
      nombre: 'Ensalada de Manzana y Nueces',
      descripcion: 'Una ensalada fresca y nutritiva con manzana, nueces y un toque de miel. Ideal para una alimentación equilibrada y llena de sabor',
      imagen: '/assets/img/recetas/ensalada-de-manzana.webp',
    },
    {
      nombre: 'Pollo con Almendras',
      descripcion: 'Delicioso salteado de pollo con almendras, bañado en una suave salsa oriental. Perfecto para una comida sabrosa y balanceada.',
      imagen: '/assets/img/recetas/PolloConAlmendras.jpg',
    }, 
    {
      nombre: 'Ensalada de Pera y Avellanas',
      descripcion: 'Refrescante ensalada de pera y avellanas, con un toque dulce y crujiente que combina frescura y elegancia en cada bocado.',
      imagen: '/assets/img/recetas/EnsaladaDePerayAvellanas.jpg',
    }, 
    {
      nombre: 'Mousse de Arandanos',
      descripcion: 'Delicado mousse de arándanos, suave y cremoso, con el equilibrio perfecto entre dulzor y acidez natural.',
      imagen: '/assets/img/recetas/MousseDeArandonos.jpg',
    }, 
    {
      nombre: 'Tarta de Maqui',
      descripcion: 'Tarta artesanal de maqui, con base crocante y un relleno naturalmente dulce y antioxidante. Un postre único del sur de Chile.',
      imagen: '/assets/img/recetas/TartaDeMaqui.jpg',
    }, 
    {
      nombre: 'Porridge de Avena con Frutas',
      descripcion: 'Porridge de avena cremoso con frutas frescas de estación. Un desayuno nutritivo, natural y lleno de energía para comenzar bien el día.',
      imagen: '/assets/img/recetas/PorridgeDeAvenaConFrutas.jpg',
    },
        {
      nombre: 'Quinoa con verduras',
      descripcion: 'Colorido plato de quinoa salteada con verduras frescas. Una opción ligera, nutritiva y perfecta para una alimentación equilibrada..',
      imagen: '/assets/img/recetas/QuinoaConVerduras.jpg',
    }, 
    {
      nombre: 'Batido de Frutas Verdes',
      descripcion: 'Refrescante batido de frutas verdes con espinaca, manzana, kiwi y pepino. Ideal para comenzar el día con energía y vitalidad.',
      imagen: '/assets/img/recetas/BatidoDeFrutasVerdes.jpg',
    }
    
  ];


  constructor() { }

  ngOnInit() {
  }

}
