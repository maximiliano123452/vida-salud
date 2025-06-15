import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children:[
       {
          path: 'productos',
          loadChildren: () => import('./productos/productos.module').then( m => m.ProductosPageModule)
        },
        {
          path: 'recetas',
          loadChildren: () => import('./recetas/recetas.module').then( m => m.RecetasPageModule)
        },
        {
          path: 'galeria',
          loadChildren: () => import('./galeria/galeria.module').then( m => m.GaleriaPageModule)
        }, 
        {
          path: '',
          redirectTo: '/tabs/productos',
          pathMatch: 'full'
        }
 
    ]
  },
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
