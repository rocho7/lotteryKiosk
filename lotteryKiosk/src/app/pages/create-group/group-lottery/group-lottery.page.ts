import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular'
@Component({
  selector: 'app-group-lottery',
  templateUrl: './group-lottery.page.html',
  styleUrls: ['./group-lottery.page.scss'],
})
export class GroupLotteryPage implements OnInit {

  constructor( private navCtrl: NavController) { }

  ngOnInit() {
  }
  create( type ) {
    switch ( type ) {
      case 'group':
        this.navCtrl.navigateForward('/form')
        break;
      case 'join':
        this.navCtrl.navigateForward('/join')
        break;
    
      default:
        break;
    }
  }
}
