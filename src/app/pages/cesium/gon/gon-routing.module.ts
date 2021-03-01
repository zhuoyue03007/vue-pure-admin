import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {GonComponent} from './gon.component';

const routes: Routes = [
  {
    path: '',
    component: GonComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GonRoutingModule { }
