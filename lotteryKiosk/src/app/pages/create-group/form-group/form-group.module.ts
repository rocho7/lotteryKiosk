import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormGroupPageRoutingModule } from './form-group-routing.module';

import { FormGroupPage } from './form-group.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FormGroupPageRoutingModule,
    TranslateModule
  ],
  declarations: [FormGroupPage]
})
export class FormGroupPageModule {}
