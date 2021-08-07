import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router'
import { SocialSharing } from '@ionic-native/social-sharing/ngx'
import { ToastController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-group-code',
  templateUrl: './group-code.page.html',
  styleUrls: ['./group-code.page.scss'],
})
export class GroupCodePage implements OnInit {
  code: any

  constructor( private activatedR: ActivatedRoute, private socialSharing: SocialSharing, private toastCtrl: ToastController,
    private navCtrl: NavController) {
   
   }
  
  ngOnInit() {
    this.activatedR.queryParams.subscribe( params => {
      this.code = params.code
    })
  }

  share( type ){
    switch ( type ) {
      case 'copy':
        this.presentToast()
        break;
      case 'media':
        this.socialSharing.share( this.code )      
        break;
    
      default:
        break;
    }
    // this.socialSharing.shareViaEmail('hola', 'que tal ', ['angelleonmer@gmail.com'])
    // .then( res =>{
    //   console.log("res ", res)
    // })
    // .catch( err => console.log("err ", err))
  }
  async presentToast(){
    const toast = await this.toastCtrl.create({
      message:`${this.code} copied to clipboard`,
      duration: 2000
    });
    toast.present();
  }
  // redirectTo(){
  //   this.navCtrl.navigateRoot('/menu/tabs/group-list')
  // }
  continue(){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        code: this.code
      }
    };
    this.navCtrl.navigateRoot('menu/tabs/users', navigationExtras)
  }
  
}
