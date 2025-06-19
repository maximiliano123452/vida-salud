import { Component, OnInit } from '@angular/core';
import { ImageViewerPage } from './image-viewer/image-viewer.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.page.html',
  styleUrls: ['./galeria.page.scss'],
  standalone:false
})
export class GaleriaPage   {

  images: string[] = [
    '/assets/img/Pilates.jpg',
    '/assets/img/Yoga.jpg',
    '/assets/img/Zumba.jpg',
    '/assets/img/Aerobox.jpg',
    '/assets/img/Crossfitt.jpg',
    '/assets/img/AndarEnBicicleta.jpg',
    '/assets/img/Natacion.jpg',
    '/assets/img/Senderismo.jpg',
    '/assets/img/HierbasMedicinales.jpg',
    '/assets/img/HuertoCasero.jpg',
    '/assets/img/PodarBonsai.jpg',
    '/assets/img/Jardineria.jpg',
    '/assets/img/Comunicacion.jpg',
    '/assets/img/NiñosConMascotas.jpg',
    '/assets/img/FamiliaJugando.jpg',
    '/assets/img/Pintando.jpg',
    '/assets/img/Caminando.jpg',
    '/assets/img/JugosNaturales.jpg',
  ];



constructor(private modalCtrl: ModalController) {}

async openImage(image: string) {
  const modal = await this.modalCtrl.create({
    component: ImageViewerPage,
    componentProps: { image },
    cssClass: 'image-modal'
  });
  await modal.present();
} 

 

}
