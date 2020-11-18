import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DisabledDirective } from './disabled.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [DisabledDirective],
  imports: [
    CommonModule,
  ],
  exports: [DisabledDirective]
})
export class DirectivesModule { }
