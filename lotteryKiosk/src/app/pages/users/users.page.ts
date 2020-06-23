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
import { LoadingService } from 'src/app/services/loading.service';
import { TranslateService } from '@ngx-translate/core';
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
    private alertCtrl: AlertController, private navCtrl: NavController, private storage: StorageService,
    private loader: LoadingService, private translate: TranslateService ) {
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
        
        this.storage.set('lastGroupCodeSelected', this.codeGroup)
        this.dataService.setData('codeGroup', this.codeGroup)
        this.getUsers()
      }else{
        let message = 'USERS.NOPLAYERS'
        let type = 'warning'
        this.showToast( message, type )
        this.navCtrl.navigateRoot('/menu/tabs/group-list')
      }
    })
  }
  getUsers() {
    this.loader.presentLoading()
    this.userService.getUsers( this.codeGroup )
        .then( userList => {
          console.log("userList ", userList)
          this.lottery.UsersList = [];
          this.lottery.UsersList = userList
          this.setUsersList()
        })
        .catch( err => {
          this.loader.hideLoading()
          })
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
      this.loader.hideLoading()
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
    this.loader.presentLoading()
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
         this.loader.hideLoading()
         let message ="USERS.ADDMONEY"
         let color = 'success'
        this.showToast( message, color );
       }
    })
  }

  async deleteUser( user: UserListClass ){
    
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
        if ( isDeleted ) this.getUsers()
      }
      let message = "USERS.CANNOTDELETEUSER"
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
      header: this.translate.instant('USERS.CONFIRM'),
      message: this.translate.instant('USERS.MESSAGE'),
      buttons: [
        {
          text: this.translate.instant('USERS.CANCEL'),
          role: 'cancel'
        },
        {
          text: this.translate.instant('USERS.REMOVE'),
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
      message: this.translate.instant( message ),
      color: color,
      duration: 2000
    });
    toast.present()
  }

}
