import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BetsPageRoutingModule } from './bets-routing.module';

import { BetsPage } from './bets.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BetsPageRoutingModule
  ],
  declarations: [BetsPage]
})
export class BetsPageModule {}
