import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular'
import { Router, RouterEvent } from '@angular/router'
import { AuthenticationService } from '../../services/authentication.service'

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  activePath = '';

  pages = [
    {
      name: 'Login',
      path: '/menu/login'
    },
    {
      name: 'Register',
      path: '/menu/register'
    },
    {
      name: 'Dashboard',
      path: '/menu/dashboard'
    }
  ]
  constructor( private navCtrl: NavController, private router: Router,  private authService: AuthenticationService ) {
    this.router.events.subscribe(( event: RouterEvent ) =>{
      console.log("event ", event)
      if ( event.url === '/menu'){
        console.log("if ", event.url)
        this.activePath === '/menu/dashboard'
      }else {
        console.log("else ", event.url)
        this.activePath = event.url
      }
    })
   }

  ngOnInit() {
    console.log("MENUPAGE isLogIng ", this.authService.isLogIn)
    if ( !this.authService.isLogIn ){
      this.navCtrl.navigateForward('/login')
    }
   
  }

}
