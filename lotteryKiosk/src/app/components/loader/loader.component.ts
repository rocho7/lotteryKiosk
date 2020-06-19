import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
  
  loader: any
  constructor( private loadingCtrl: LoadingController) {}

  ngOnInit() {

  }

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
