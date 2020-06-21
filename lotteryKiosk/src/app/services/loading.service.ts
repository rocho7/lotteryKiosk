import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  loader: any
  constructor( private loadingCtrl: LoadingController) { }
  async presentLoading(){

    this.loader = await this.loadingCtrl.create({
      spinner: null,
      // duration: 3000,
      message: '<img src="../../../assets/imgs/loading/cube.svg">',
      translucent: false,
      backdropDismiss: false
    })
    await this.loader.present()    
  }
  hideLoading(){
      this.loader.dismiss()
  }
}
