import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'group-list',
        loadChildren: () => import('../create-group/group-list/group-list.module').then( m => m.GroupListPageModule )
      },
      {
        path: 'users',
        loadChildren: () => import('../users/users.module').then( m => m.UsersPageModule )
      },
      {
        path: 'bets',
        loadChildren: () => import ('../bets/bets.module').then( m => m.BetsPageModule)
      },
      {
        path: 'calendar',
        loadChildren: () => import ('../calendar/calendar.module').then( m => m.CalendarPageModule)
      }
    ]
  },
  {
    path: '',
    redirectTo: 'tabs/group-list',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
