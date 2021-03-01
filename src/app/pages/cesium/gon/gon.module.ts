import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GonRoutingModule } from './gon-routing.module';
import { GonComponent } from './gon.component';


@NgModule({
  declarations: [GonComponent],
  imports: [
    CommonModule,
    GonRoutingModule
  ]
})
export class GonModule { }
