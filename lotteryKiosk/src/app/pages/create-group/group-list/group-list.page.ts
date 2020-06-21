import { Component, OnInit, ViewChild } from '@angular/core';
import { GroupService } from 'src/app/providers/group.service';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { UsersService } from 'src/app/providers/users.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NavigationExtras } from '@angular/router'
import { StorageService } from 'src/app/services/store/storage.service'
import { DataService } from 'src/app/providers/data-service.service';
import { LoadingService } from 'src/app/services/loading.service';
@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.page.html',
  styleUrls: ['./group-list.page.scss'],
})
export class GroupListPage implements OnInit {

  groupList = []
  currentUser = []
  userObserver: any
  codeGroupObserver: any
  isGroupSelected: string
  
  constructor( private groupService: GroupService, private alertCtrl: AlertController, private userService: UsersService, 
    private navCtrl: NavController, private storage: StorageService,
    private dataService: DataService, private toastCtrl: ToastController, private loader: LoadingService ) { 
    this.userObserver = this.userService.userWatcher$
    this.codeGroupObserver = this.userService.codeGroup$
  }


  ngOnInit() {
    this.userObserver.subscribe( user => {
      if ( user[0] ) {
        this.currentUser = []
        this.currentUser = user
        this.loader.presentLoading()      
        this.getUserGroups()
      }
    })
    this.codeGroupObserver.subscribe( code =>{
      this.isGroupSelected = code
    })
  }
 

  getUserGroups(){
    this.groupService.getAllGroups()
    .subscribe( groups => {
      this.groupList = []
      groups.forEach( group => {
        this.currentUser.forEach( lineUser => {
          if ( lineUser.hasOwnProperty('codes') ){
            lineUser.codes.forEach( ( codeUser , index ) => {
              if ( codeUser === group.payload.doc.data()['code'] ){
                this.groupList.push( {
                  data: group.payload.doc.data(),
                  id: group.payload.doc.id
                 })
              }
            });
          }
        });
      });
      if ( this.groupList.length > 0 ){
        
        this.storage.get('lastGroupCodeSelected')
        .then( code => {
          console.log("code ", code)
            this.isGroupSelected = code || this.groupList[0].data.code
            this.setGroupSelected( this.isGroupSelected )          
        })
      }
      this.loader.hideLoading()
    })
  }

  async deleteGroup( group ) {
    if ( this.currentUser[0].idrole === 'ROLE_AD' ){
      let isDeleted = await this.presentAlertConfirm()
        if ( isDeleted.role === 'accept' ){
          this.loader.presentLoading()
          let uid = group.id
          let groupRemoved = await this.groupService.removeGroup( uid )
          if ( groupRemoved ){
            this.storage.remove('lastGroupCodeSelected')
            this.getUserGroups()
          }
        }      
    }else{
      let message = "You can not delete a group. You are not ADMIN"
      let type = 'warning'
      this.showToast( message, type )
    }
    
  }

  goToUserList( group ) {
    let navigationExtras: NavigationExtras = {
      queryParams:{
        code: group.data.code
      }
    }
    this.navCtrl.navigateForward('/menu/tabs/users', navigationExtras)
  }
  async presentAlertConfirm() {
    const alert = await this.alertCtrl.create({
      header: 'Confirm',
      message: 'Do you really want to delete this group?',
      buttons:[
        {
          text: 'Cancel',
          role: 'cancel',
          handler: ()=>{}
        },
        {
          text: 'Accept',
          role: 'accept',
          handler: ()=> {
            return true
          }
        }
      ]
    })
    await alert.present();
    const result = await alert.onDidDismiss();  
    return result
  }
  setGroupSelected( code ) {
    this.storage.set('lastGroupCodeSelected', code)
    this.dataService.setData('codeGroup', code)
  }
  async showToast( message, type ){
    let toast = await this.toastCtrl.create({
      message: message,
      color: type,
      duration: 2000
    })
    toast.present()
  }

}
