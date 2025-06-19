import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatosSaludPage } from './datos-salud.page';

const routes: Routes = [
  {
    path: '',
    component: DatosSaludPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatosSaludPageRoutingModule {}
