import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroupCodePageRoutingModule } from './group-code-routing.module';

import { GroupCodePage } from './group-code.page';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GroupCodePageRoutingModule,
    TranslateModule
  ],
  declarations: [GroupCodePage],
  providers: [SocialSharing]
})
export class GroupCodePageModule {}
