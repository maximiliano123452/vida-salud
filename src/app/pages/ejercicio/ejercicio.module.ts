import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { EjercicioPageRoutingModule } from './ejercicio-routing.module';
import { EjercicioPage } from './ejercicio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EjercicioPageRoutingModule
  ],
  declarations: [EjercicioPage]
})
export class EjercicioPageModule {}
