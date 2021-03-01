import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzRadioModule } from 'ng-zorro-antd/radio';

import { WindRoutingModule } from './wind-routing.module';
import { WindComponent } from './wind.component';
import {FormsModule} from '@angular/forms';
import {WindService} from './wind.service';


@NgModule({
  declarations: [WindComponent],
  imports: [
    CommonModule,
    WindRoutingModule,
    NzRadioModule,
    FormsModule
  ],
  providers: [WindService]
})
export class WindModule { }
