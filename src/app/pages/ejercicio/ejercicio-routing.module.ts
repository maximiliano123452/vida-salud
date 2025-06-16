import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EjercicioPage } from './ejercicio.page';

const routes: Routes = [
  {
    path: '',
    component: EjercicioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EjercicioPageRoutingModule {}

