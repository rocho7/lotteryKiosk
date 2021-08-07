import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BetsListPage } from './bets-list.page';

const routes: Routes = [
  {
    path: '',
    component: BetsListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BetsListPageRoutingModule {}
