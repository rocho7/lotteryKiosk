import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupLotteryPage } from './group-lottery.page';

const routes: Routes = [
  {
    path: '',
    component: GroupLotteryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupLotteryPageRoutingModule {}
