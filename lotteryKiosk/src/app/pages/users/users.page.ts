import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../providers/users.service'
import { User } from '../../classes/user'
import { UserListClass } from '../../classes/userClassModel'
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
  
  user = new User();
  list: any
  roleList = [];
  balance = []
  constructor( private userService: UsersService, public modalCtrl: ModalController, private toastCtrl: ToastController,
    private authService: AuthenticationService, private dataService: DataService, private activatedRoute: ActivatedRoute ) {
    (<any>window).user = this.user;
    console.log( this.authService.userDetails() )
   }

  ngOnInit() {
    let codeGroup = ''
    this.activatedRoute.queryParams.subscribe( group =>{
      console.log(group)

      codeGroup = group.data ? group.data.code : group.code
      if ( codeGroup ) {
        this.userService.getUsers( codeGroup )
        .then( userList => {
          console.log("userList ", userList)
          this.user.UsersList = [];
          this.user.UsersList = userList
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
        this.user.RoleList = []
        this.user.RoleList = this.roleList
      } )
    })

    this.userService.getBalance().subscribe( data => {
      this.balance = []
      data.forEach( ( balance: any ) =>{
        this.balance.push({
          id: balance.payload.doc.id,
          data: balance.payload.doc.data()
        });
      })
      this.user.BalanceList = []
      this.user.BalanceList = this.balance;
      this.dataService.setData('userList', this.user.UsersList)
    })
  }

  async openPersonalBalanceModel( user: UserListClass ) {
    user._date = new Date().toISOString()
    const modal = await this.modalCtrl.create({
      component: ModalPersonalBalancePage,
      componentProps: {
        user: user
      }
    });
    modal.onDidDismiss().then((userData) => {
      if (userData.data !== null) {
        this.setBalance( userData )
      }
    });
    return await modal.present();
  }
  setBalance( user ){
    let data = {
      amount: user.data.amount,
      date: new Date( user.data._date ),
      iduser: user.data.id
    }
    console.log("user ", user, " typeof ", typeof user)

    this.userService.addBalance( data )
     .then( res => {
       if ( res.id ) {
        this.showToast( user.data );
       }
    })
  }

  async showToast( user: User ){
    const toast = await this.toastCtrl.create({
      message: `You add some money to ${user._name}'s balance`,
      duration: 2000
    });
    toast.present()
  }

}
