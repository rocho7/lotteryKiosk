import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroupListPageRoutingModule } from './group-list-routing.module';

import { GroupListPage } from './group-list.page';
import { TranslateModule } from '@ngx-translate/core';
import { FiltroComponent } from 'src/app/pipes/filtro/filtro.component';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    PipesModule,
    CommonModule,
    FormsModule,
    IonicModule,
    GroupListPageRoutingModule,
    TranslateModule
  ],
  declarations: [GroupListPage, FiltroComponent]
})
export class GroupListPageModule {}
