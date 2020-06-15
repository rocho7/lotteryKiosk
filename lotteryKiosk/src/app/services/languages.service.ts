import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from './store/storage.service';

const LNG_KEY = 'SELECTED_LANGUAGE'

@Injectable({
  providedIn: 'root'
})
export class LanguagesService {

  selected = ''

  constructor( private translate: TranslateService, private storage: StorageService) { }

  setInitialAppLanguage(){
    let language = this.translate.getBrowserLang();
    this.translate.setDefaultLang( language );

    this.setLanguage( language )
  }
  getLanguages(){
    return [
      { text: 'English', value: 'en', img: 'assets/imgs/en.png'},
      { text: 'Spanish', value: 'es', img: 'assets/imgs/es.png'},
      { text: 'Valenciano', value: 'val', img: 'assets/imgs/val.png'}
    ]
  }
  setLanguage( lng ) {
    this.translate.use( lng )
    this.selected = lng
  }
}
