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
    '/assets/img/imagen1.jpg',
    '/assets/img/imagen2.jpg',
    '/assets/img/imagen3.jpg',
    '/assets/img/imagen4.jpg',
    '/assets/img/imagen5.jpg',
    '/assets/img/imagen6.jpg',
    '/assets/img/imagen7.jpg',
    '/assets/img/imagen8.jpg',
    '/assets/img/imagen9.jpg',
    '/assets/img/imagen10.jpg',
    '/assets/img/imagen11.jpg',
    '/assets/img/imagen12.jpg',
    '/assets/img/imagen12.jpg',
    '/assets/img/imagen14.jpg',
    '/assets/img/imagen15.jpg',
    '/assets/img/imagen16.jpg',
    '/assets/img/imagen17.jpg',
    // Agrega más imágenes aquí
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
