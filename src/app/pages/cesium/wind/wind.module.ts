import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WindRoutingModule } from './wind-routing.module';
import { WindComponent } from './wind.component';


@NgModule({
  declarations: [WindComponent],
  imports: [
    CommonModule,
    WindRoutingModule
  ]
})
export class WindModule { }
