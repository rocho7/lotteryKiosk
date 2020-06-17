import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../providers/users.service'
import { Lottery } from '../../classes/lottery'
import { UserListClass, balanceClassModel } from '../../classes/userClassModel'
import { ModalController, ToastController, AlertController, NavController } from '@ionic/angular'
import { ModalPersonalBalancePage } from './modal-personal-balance/modal-personal-balance.page'
import { AuthenticationService } from '../../services/authentication.service'
import { DataService } from '../../providers/data-service.service'
import { ActivatedRoute } from '@angular/router';
import { StorageService } from 'src/app/services/store/storage.service';
@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  
  lottery = new Lottery();
  list: any
  roleList = [];
  codeGroup:string = ''
  userObserver: any
  currentUser = []

  constructor( private userService: UsersService, public modalCtrl: ModalController, private toastCtrl: ToastController,
    private authService: AuthenticationService, private dataService: DataService, private activatedRoute: ActivatedRoute,
    private alertCtrl: AlertController, private navCtrl: NavController, private storage: StorageService ) {
    (<any>window).lottery = this.lottery;
    console.log( this.authService.userDetails() )
      this.userObserver = this.userService.userWatcher$
      this.userObserver.subscribe( user => {
        this.currentUser = user[0]
      })
   }

  ngOnInit() {
    
    this.activatedRoute.queryParams.subscribe( group =>{
      console.log(group)

      this.codeGroup = group.code || this.dataService.getData('codeGroup')
      if ( this.codeGroup ) {
        this.getUsers()
      }else{
        let message = 'No players in user section. Please select a group'
        let type = 'warning'
        this.showToast( message, type )
        this.navCtrl.navigateRoot('/menu/tabs/group-list')
      }
    })
  }
  getUsers() {
    this.userService.getUsers( this.codeGroup )
        .then( userList => {
          console.log("userList ", userList)
          this.lottery.UsersList = [];
          this.lottery.UsersList = userList
          this.setUsersList()
        })
        .catch( err => console.log("error ", err))
  }
  setUsersList(){
    this.userService.getRoles().subscribe( data => {
      this.roleList = [];
      data.forEach( ( role: any ) =>{
        this.roleList.push({
          id: role.payload.doc.id,
          data: role.payload.doc.data()
        });
        this.lottery.RoleList = []
        this.lottery.RoleList = this.roleList
      } )
    })

    this.userService.getBalance( this.codeGroup )
    .then( balance => {
      this.lottery.BalanceList = []
      this.lottery.BalanceList = balance;
      this.dataService.setData('userList', this.lottery.UsersList)
    })
  }

  async openPersonalBalanceModel( user: UserListClass ) {
    user._amount = 0
    const modal = await this.modalCtrl.create({
      component: ModalPersonalBalancePage,
      componentProps: {
        user: user
      }
    });
    modal.onDidDismiss().then((newBalance) => {
      if (newBalance.data !== null) {
        this.setBalance( newBalance.data )
      }
    });
    return await modal.present();
  }
  setBalance( newBalance: UserListClass ){
    let newUser = Object.assign( new UserListClass(), newBalance )
    let balance = new balanceClassModel();
    balance.amount = newBalance.amount
    balance.codes = this.codeGroup
    balance.uid = newBalance.uid
    balance.date.seconds = Math.floor(<any>new Date(newBalance.date) / 1000)
    this.lottery.BalanceList.push( balance );
    this.lottery.BalanceList = this.lottery.BalanceList

    let data = {
      amount: newUser.amount,
      date: new Date( newUser.date ),
      uid: newUser.uid,
      codes: this.codeGroup
    }

    this.userService.addBalance( data )
     .then( res => {
       if ( res.id ) {
         let message =`You add some money to ${newUser.name}'s balance`
         let color = 'success'
        this.showToast( message, color );
       }
    })
  }

  async deleteUser( user: UserListClass ){
    let userDeleted = this.lottery.UsersList.filter( userLine => userLine.uid === user.uid )
      console.log("userDeleted ", userDeleted)
    let isDeleted = null
    if ( this.currentUser['uid'] === user.uid ) {
          isDeleted = await this.deleteUserAndConfirm( user )

          if ( isDeleted ){
            this.storage.remove('userInfo')
            this.storage.remove('lastGroupCodeSelected')
            this.navCtrl.navigateRoot('/login')
          }
    }else {
      if ( this.currentUser['idrole'] === 'ROLE_AD' ){
        isDeleted = await this.deleteUserAndConfirm( user)
      }
      let message = "You can not delete an user. You are not ADMIN"
      let color = 'warning'
      this.showToast( message, color );

    }    
  }
  async deleteUserAndConfirm(user : UserListClass) {
      let isUserDeleted = await this.presentAlertConfirm()

      if (isUserDeleted.role === 'remove') {
          let authUser = await this.deleteAuthUser(user)
          return authUser
      }
  }

  async deleteAuthUser(user : UserListClass) {
      let removeUser = await this.authService.removeUser(user.uid)
      return removeUser
  }


  async presentAlertConfirm(){
    const alert = await this.alertCtrl.create({
      header: 'Confirm',
      message: 'Do you really want to delete this user?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Remove',
          role: 'remove'
        }
      ]
    });
    await alert.present()
    let result = await alert.onDidDismiss()
    return result
  }

  async showToast( message: string, color ){
    const toast = await this.toastCtrl.create({
      message: message,
      color: color,
      duration: 2000
    });
    toast.present()
  }

}
