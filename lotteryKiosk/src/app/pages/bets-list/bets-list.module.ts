import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BetsListPageRoutingModule } from './bets-list-routing.module';

import { BetsListPage } from './bets-list.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BetsListPageRoutingModule,
    TranslateModule
  ],
  declarations: [BetsListPage]
})
export class BetsListPageModule {}
