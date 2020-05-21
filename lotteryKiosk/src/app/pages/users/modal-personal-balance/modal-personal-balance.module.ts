import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalPersonalBalancePageRoutingModule } from './modal-personal-balance-routing.module';

import { ModalPersonalBalancePage } from './modal-personal-balance.page';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalPersonalBalancePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ModalPersonalBalancePage]
})
export class ModalPersonalBalancePageModule {}
