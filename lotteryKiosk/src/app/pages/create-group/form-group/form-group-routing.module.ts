import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormGroupPage } from './form-group.page';

const routes: Routes = [
  {
    path: '',
    component: FormGroupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormGroupPageRoutingModule {}
