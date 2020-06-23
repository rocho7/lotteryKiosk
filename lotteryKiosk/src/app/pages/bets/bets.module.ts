import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BetsPageRoutingModule } from './bets-routing.module';

import { BetsPage } from './bets.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    BetsPageRoutingModule,
    TranslateModule
  ],
  declarations: [BetsPage]
})
export class BetsPageModule {}
