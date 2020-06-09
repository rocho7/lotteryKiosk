import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JoinGroupPageRoutingModule } from './join-group-routing.module';

import { JoinGroupPage } from './join-group.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    JoinGroupPageRoutingModule
  ],
  declarations: [JoinGroupPage]
})
export class JoinGroupPageModule {}
