import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BetsListPageRoutingModule } from './bets-list-routing.module';

import { BetsListPage } from './bets-list.page';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { FiltroComponent } from 'src/app/pipes/filtro/filtro.component';

@NgModule({
  imports: [
    PipesModule,
    CommonModule,
    FormsModule,
    IonicModule,
    BetsListPageRoutingModule,
    TranslateModule
  ],
  declarations: [BetsListPage, FiltroComponent]
})
export class BetsListPageModule {}
