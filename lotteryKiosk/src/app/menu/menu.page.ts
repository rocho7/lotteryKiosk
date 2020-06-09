import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular'
import { Router, RouterEvent } from '@angular/router'
import { AuthenticationService } from '../services/authentication.service'
import { UsersService } from '../providers/users.service'
import { User } from '../classes/user'
import { DataService } from '../providers/data-service.service'
import { error } from 'protractor';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  activePath = '';
  user = new User();
  list = []
  roleList = []
  balance = []
  currentPage: string

  pages = [
    {
      name: 'List of groups',
      path: '/menu/group-list'
    },
    {
      name: 'Dashboard',
      path: '/menu/dashboard'
    },
    {
      name: 'Users',
      path: '/menu/users'
    },
    {
      name: 'Calendar',
      path: '/menu/calendar'
    },
    {
      name: 'Bets',
      path: '/menu/bets'
    }
  ]
  constructor( private navCtrl: NavController, private router: Router,  private authService: AuthenticationService, 
    private userService: UsersService, private dataService: DataService ) {
    this.router.events.subscribe(( event: RouterEvent ) =>{
      this.activePath = event.url
      let currentPageIndex = null
      this.currentPage = ""
      if( !event.url ) {
        this.activePath = this.pages[0].path
        currentPageIndex = this.activePath.split('/').length
        this.currentPage = this.activePath.split('/')[currentPageIndex-1]
      }
    })
   }

   ngOnInit() {
    // this.userService.getUsers().subscribe( data => {
      
    // this.list = []
    //   data.forEach( ( line : any ) => {
    //     this.list.push({
    //       id: line.payload.doc.id,
    //       data: line.payload.doc.data()
    //     });
    //   })
    //   this.user.UsersList = [];
    //   this.user.UsersList = this.list;
    // })

    // this.userService.getRoles().subscribe( data => {
    //   this.roleList = [];
    //   data.forEach( ( role: any ) =>{
    //     this.roleList.push({
    //       id: role.payload.doc.id,
    //       data: role.payload.doc.data()
    //     });
    //     this.user.RoleList = []
    //     this.user.RoleList = this.roleList
    //   } )
    // })

    // this.userService.getBalance().subscribe( data => {
    //   this.balance = []
    //   data.forEach( ( balance: any ) =>{
    //     this.balance.push({
    //       id: balance.payload.doc.id,
    //       data: balance.payload.doc.data()
    //     });
    //   })
    //   this.user.BalanceList = []
    //   this.user.BalanceList = this.balance;
    //   this.dataService.setData('userList', this.user.UsersList)
    // })
  }
  logOut(){
    this.authService.loginOutUser()
    .then( res => {
      if ( res ) {
        this.navCtrl.navigateRoot('/login')
      }
    }).catch( error =>{
      console.error(error)
    })
  }
  goTo(){
    this.navCtrl.navigateForward('/group')
  }

}
