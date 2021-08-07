import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroupIndexPageRoutingModule } from './group-index-routing.module';

import { GroupIndexPage } from './group-index.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GroupIndexPageRoutingModule
  ],
  declarations: [GroupIndexPage]
})
export class GroupIndexPageModule {}
