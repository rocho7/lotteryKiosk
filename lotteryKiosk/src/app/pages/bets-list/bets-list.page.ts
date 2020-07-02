import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { BetsService } from 'src/app/providers/bets.service';
import { StorageService } from 'src/app/services/store/storage.service';
import { UsersService } from 'src/app/providers/users.service';
import { NavigationExtras } from '@angular/router';
import { database } from 'firebase';
import { DataService } from 'src/app/providers/data-service.service';

@Component({
  selector: 'app-bets-list',
  templateUrl: './bets-list.page.html',
  styleUrls: ['./bets-list.page.scss'],
})
export class BetsListPage implements OnInit {

  groupCode: any 
  codeGroupObserver: any
  betsList: Array<object> = []

  constructor( private navCtrl: NavController, private betService: BetsService, private storage: StorageService, 
    private userService: UsersService, private dataService: DataService) {
    this.codeGroupObserver = this.userService.codeGroup$

     }

  ngOnInit() {
    this.codeGroupObserver.subscribe( code => {
      this.groupCode = code 
      this.getBetsList()
    })
  }
  async getBetsList(){
    this.groupCode = this.groupCode || await this.storage.get('lastGroupCodeSelected')
    if ( this.groupCode ) {
      this.betService.getBetsList()
      .subscribe( res => {
        this.betsList = []
        res.forEach( betsListLine => {
          console.log("betsListLine.payload.doc.data() ", betsListLine.payload.doc.data())
          if ( betsListLine.payload.doc.data()['code'] === this.groupCode ){
            this.betsList.push({
              id: betsListLine.payload.doc.id,
              data: betsListLine.payload.doc.data()
            })
          }
        });
        console.log("betsList ", this.betsList)
      })
    }
  }

  goToBets(){
    this.navCtrl.navigateForward('/menu/tabs/bets')
  }
  checkBets( index: number ){
    let navigationExtras: NavigationExtras = {
      queryParams:{
        betsList: this.betsList[index]
      }
    }
    this.navCtrl.navigateForward('/menu/tabs/bets', navigationExtras)
  }

}
