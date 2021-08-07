import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupCodePage } from './group-code.page';

const routes: Routes = [
  {
    path: '',
    component: GroupCodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupCodePageRoutingModule {}
