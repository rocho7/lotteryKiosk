import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../authentication.service'
import { NavController } from '@ionic/angular'
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  user: object
  constructor( private authService: AuthenticationService, private navCtrl: NavController ){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
      this.user ={
        ...this.authService.userDetails()
      } 
      
      if ( !this.user.hasOwnProperty('uid') ) this.navCtrl.navigateRoot('/login')
      
    return this.authService.isLogIn;
  }
  
}
