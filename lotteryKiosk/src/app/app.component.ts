import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LanguagesService } from './services/languages.service';
import { StorageService } from './services/store/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  currentUser: any

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private languagesService: LanguagesService,
    private storage: StorageService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.getUserInfoFromStorage()
    });
  }
  async getUserInfoFromStorage(){
    this.currentUser = await this.storage.get('userInfo')
    if ( this.currentUser ) {
      this.languagesService.setInitialAppLanguage( this.currentUser.userInfoDB[0].language );
    }else{
      this.languagesService.setInitialAppLanguage();
    }
  }
}
