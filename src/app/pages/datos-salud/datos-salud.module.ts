import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosSaludPageRoutingModule } from './datos-salud-routing.module';

import { DatosSaludPage } from './datos-salud.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosSaludPageRoutingModule
  ],
  declarations: [DatosSaludPage]
})
export class DatosSaludPageModule {}
