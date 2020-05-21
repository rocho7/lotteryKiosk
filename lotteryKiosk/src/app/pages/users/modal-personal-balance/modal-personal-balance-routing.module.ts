import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalPersonalBalancePage } from './modal-personal-balance.page';

const routes: Routes = [
  {
    path: '',
    component: ModalPersonalBalancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalPersonalBalancePageRoutingModule {}
