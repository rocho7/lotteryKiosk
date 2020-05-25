import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { MenuPage } from './menu/menu.page';
import { LoginPage } from './pages/login/login.page'
import { RegisterPage } from './pages/register/register.page'

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '',
    loadChildren: () => import('./index/index.module').then( m => m.IndexPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./menu/menu.module').then( m => m.MenuPageModule),
  },  {
    path: 'users',
    loadChildren: () => import('./pages/users/users.module').then( m => m.UsersPageModule)
  },
  {
    path: 'calendar',
    loadChildren: () => import('./pages/calendar/calendar.module').then( m => m.CalendarPageModule)
  },
  {
    path: 'bets',
    loadChildren: () => import('./pages/bets/bets.module').then( m => m.BetsPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
