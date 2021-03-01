import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarTrackRoutingModule } from './car-track-routing.module';
import { CarTrackComponent } from './car-track.component';


@NgModule({
  declarations: [CarTrackComponent],
  imports: [
    CommonModule,
    CarTrackRoutingModule
  ]
})
export class CarTrackModule { }
