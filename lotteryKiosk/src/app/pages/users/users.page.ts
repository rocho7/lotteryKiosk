import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../providers/users.service'
import { Lottery } from '../../classes/lottery'
import { UserListClass, balanceClassModel } from '../../classes/userClassModel'
import { ModalController, ToastController } from '@ionic/angular'
import { ModalPersonalBalancePage } from './modal-personal-balance/modal-personal-balance.page'
import { AuthenticationService } from '../../services/authentication.service'
import { DataService } from '../../providers/data-service.service'
import { ActivatedRoute } from '@angular/router';
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

  constructor( private userService: UsersService, public modalCtrl: ModalController, private toastCtrl: ToastController,
    private authService: AuthenticationService, private dataService: DataService, private activatedRoute: ActivatedRoute ) {
    (<any>window).lottery = this.lottery;
    console.log( this.authService.userDetails() )
   }

  ngOnInit() {
    
    this.activatedRoute.queryParams.subscribe( group =>{
      console.log(group)

      this.codeGroup = group.code || this.dataService.getData('codeGroup')
      if ( this.codeGroup ) {
        this.userService.getUsers( this.codeGroup )
        .then( userList => {
          console.log("userList ", userList)
          this.lottery.UsersList = [];
          this.lottery.UsersList = userList
          this.setUsersList()
        })  
      }
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
        this.showToast( newUser );
       }
    })
  }

  async showToast( user: UserListClass ){
    const toast = await this.toastCtrl.create({
      message: `You add some money to ${user.name}'s balance`,
      duration: 2000
    });
    toast.present()
  }

}
