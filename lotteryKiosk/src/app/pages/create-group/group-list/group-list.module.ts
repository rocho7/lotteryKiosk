import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroupListPageRoutingModule } from './group-list-routing.module';

import { GroupListPage } from './group-list.page';
import { LoaderComponent } from 'src/app/components/loader/loader.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GroupListPageRoutingModule
  ],
  declarations: [GroupListPage, LoaderComponent]
})
export class GroupListPageModule {}
