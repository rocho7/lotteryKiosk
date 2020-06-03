import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: 'menu',
    component: MenuPage,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('../pages/dashboard/dashboard.module').then( m => m.DashboardPageModule)
      },
      {
        path: 'users',
        loadChildren: () => import('../pages/users/users.module').then( m => m.UsersPageModule )
      },
      {
        path: 'calendar',
        loadChildren: () => import ('../pages/calendar/calendar.module').then( m => m.CalendarPageModule)
      },
      {
        path: 'bets',
        loadChildren: () => import ('../pages/bets/bets.module').then( m => m.BetsPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
