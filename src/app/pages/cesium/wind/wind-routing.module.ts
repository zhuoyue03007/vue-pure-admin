import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {WindComponent} from "./wind.component";

const routes: Routes = [
  {
    path: '',
    component: WindComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WindRoutingModule { }
