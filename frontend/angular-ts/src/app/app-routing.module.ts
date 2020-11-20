import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectivePreloadingStrategyService } from '../CX/services/selective-preloading-strategy.service';

const routes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      {
        preloadingStrategy:  SelectivePreloadingStrategyService
      }
    )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
