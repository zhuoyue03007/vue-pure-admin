import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {CarTrackComponent} from './car-track.component';

const routes: Routes = [
  {
    path: '',
    component: CarTrackComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarTrackRoutingModule { }
