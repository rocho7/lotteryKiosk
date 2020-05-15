import { NgModule, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular'
import { Routes, RouterModule } from '@angular/router';

import { MenuPage } from './menu.page';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'dashboard'  
  // },
  {
    path: 'menu',
    component: MenuPage,
    children: [
      {
        path: 'login',
        loadChildren: ()=>import( '../login/login.module').then (m=> m.LoginPageModule)
      },
      {
        path: 'register',
        loadChildren: () => import('../register/register.module').then( m => m.RegisterPageModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('../dashboard/dashboard.module').then( m => m.DashboardPageModule)
      }
    ]
  },
  {
    path: 'login',
    loadChildren: ()=>import( '../login/login.module').then (m=> m.LoginPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
