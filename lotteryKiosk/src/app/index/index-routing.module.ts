import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexPage } from './index.page';

const routes: Routes = [
  {
    path: '',
    component: IndexPage,
    children: [
      {
        path: 'login',
        loadChildren: ()=>import( '../pages/login/login.module').then (m=> m.LoginPageModule)
      },
      {
        path: 'register',
        loadChildren: () => import('../pages/register/register.module').then( m => m.RegisterPageModule)
      } 
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndexPageRoutingModule {}
