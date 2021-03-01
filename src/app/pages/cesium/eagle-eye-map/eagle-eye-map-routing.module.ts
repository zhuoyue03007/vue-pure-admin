import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {EagleEyeMapComponent} from './eagle-eye-map.component';

const routes: Routes = [
  {
    path: '',
    component: EagleEyeMapComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EagleEyeMapRoutingModule { }
