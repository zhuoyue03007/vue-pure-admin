import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/gis',
  },
  {
    path: 'gis',
    loadChildren: () => import('./super-map-gis/super-map-gis.module').then(m => m.SuperMapGisModule)
  },
  {
    path: 'icon',
    loadChildren: () => import('./icon/icon.module').then(m => m.IconModule)
  },
  {
    path: 'line',
    loadChildren: () => import('./line/line.module').then(m => m.LineModule)
  },
  {
    path: 'gon',
    loadChildren: () => import('./gon/gon.module').then(m => m.GonModule)
  },
  {
    path: 'eem',
    loadChildren: () => import('./eagle-eye-map/eagle-eye-map.module').then(m => m.EagleEyeMapModule)
  },
  {
    path: 'wind',
    loadChildren: () => import('./wind/wind.module').then(m => m.WindModule)
  },
  {
    path: 'car-track',
    loadChildren: () => import('./car-track/car-track.module').then(m => m.CarTrackModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CesiumRoutingModule { }
