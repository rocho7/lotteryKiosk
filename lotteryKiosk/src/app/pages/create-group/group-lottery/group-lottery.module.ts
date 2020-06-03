import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroupLotteryPageRoutingModule } from './group-lottery-routing.module';

import { GroupLotteryPage } from './group-lottery.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GroupLotteryPageRoutingModule
  ],
  declarations: [GroupLotteryPage]
})
export class GroupLotteryPageModule {}
