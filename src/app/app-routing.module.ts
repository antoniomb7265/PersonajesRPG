import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'detalle/:id', loadChildren: './detalle/detalle.module#DetallePageModule' },
  { path: 'configurar', loadChildren: './configurar/configurar.module#ConfigurarPageModule' },
  { path: 'mapa', loadChildren: './mapa/mapa.module#MapaPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
