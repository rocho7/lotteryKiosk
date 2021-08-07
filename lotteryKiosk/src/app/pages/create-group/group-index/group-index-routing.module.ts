import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupIndexPage } from './group-index.page';

const routes: Routes = [
  {
    path: '',
    component: GroupIndexPage,
    children: [
      {
        path: 'group',
        loadChildren: () => import('../group-lottery/group-lottery.module').then( m => m.GroupLotteryPageModule ),
        // children:[
        //   {
        //     path: 'form',
        //     loadChildren: () => import('../form-group/form-group.module').then( m => m.FormGroupPageModule )
        //   }
        // ]
      },
      {
        path: 'join',
        loadChildren: () => import('../join-group/join-group.module').then( m => m.JoinGroupPageModule )
      },
      {
        path: 'form',
        loadChildren: () => import('../form-group/form-group.module').then( m => m.FormGroupPageModule )
      },
      {
        path: 'group-code',
        loadChildren: () => import('../group-code/group-code.module').then( m => m.GroupCodePageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupIndexPageRoutingModule {}
