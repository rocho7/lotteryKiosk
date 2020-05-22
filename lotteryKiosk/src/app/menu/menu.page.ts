import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular'
import { Router, RouterEvent } from '@angular/router'
import { AuthenticationService } from '../services/authentication.service'
import { error } from 'protractor';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  activePath = '';

  pages = [
    {
      name: 'Dashboard',
      path: '/menu/dashboard'
    },
    {
      name: 'Users',
      path: '/menu/users'
    },
    {
      name: 'Update register',
      path: '/register'
    }
  ]
  constructor( private navCtrl: NavController, private router: Router,  private authService: AuthenticationService ) {
    this.router.events.subscribe(( event: RouterEvent ) =>{
      this.activePath = event.url

      if( !event.url ) {
        this.activePath = this.pages[0].path
      }
      // if ( event.url === '/menu'){
      //   this.activePath = '/menu/dashboard';
      //   console.log("this.pages[0].path ", this.pages[0].path)
      //   console.log("this.activePath ", this.activePath)
      // }else {
      //   this.activePath = event.url
      // }

      // console.log("this.activePath ", this.activePath)
    })
   }

  ngOnInit() {
    console.log("MENUPAGE isLogIng ", this.authService.isLogIn)
    // console.log("this.pages ", this.pages)
    if ( !this.authService.isLogIn ){
      // this.navCtrl.navigateForward('/login')
    }
   
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

}
