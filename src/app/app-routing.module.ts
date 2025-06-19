import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';

const routes: Routes = [
  // ✅ Páginas públicas (sin guards o con NoAuthGuard)
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
    canActivate: [NoAuthGuard]
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then(m => m.RegistroPageModule),
    canActivate: [NoAuthGuard]
  },
  
  // ✅ CORRECCIÓN: Ruta raíz va a LOGIN (como siempre ha sido)
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  
  // ✅ Páginas protegidas (requieren login)
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'alimentacion',
    loadChildren: () => import('./pages/alimentacion/alimentacion.module').then(m => m.AlimentacionPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'ejercicio',
    loadChildren: () => import('./pages/ejercicio/ejercicio.module').then(m => m.EjercicioPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'bienestar',
    loadChildren: () => import('./pages/bienestar/bienestar.module').then(m => m.BienestarPageModule),
    canActivate: [AuthGuard]
  },
  
  // ✅ Página 404 (accesible para todos)
  {
    path: 'page-not-found',
    loadChildren: () => import('./pages/page-not-found/page-not-found.module').then(m => m.PageNotFoundPageModule)
  },
  
  // ✅ Ruta wildcard
  {
    path: '**',
    redirectTo: 'page-not-found'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }