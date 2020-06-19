import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';
import { TranslateModule } from '@ngx-translate/core'
import { LoginPage } from './login.page';
import { LoaderComponent } from 'src/app/components/loader/loader.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    LoginPageRoutingModule,
    TranslateModule
  ],
  declarations: [LoginPage, LoaderComponent]
})
export class LoginPageModule {}
