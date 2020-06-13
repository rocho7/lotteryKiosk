import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import * as firebase from 'firebase'
import { Observable } from 'rxjs';
import { UsersService } from '../providers/users.service';
import { StorageService } from 'src/app/services/store/storage.service'
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isLogIn = false;
  currentUser = []
  userObserver: any

  constructor( private afAuth : AngularFireAuth, private userService: UsersService, private storage: StorageService ) { 
    this.userObserver = this.userService.userWatcher$
  }

  registerUser( value ) {
    return new Promise<any>((resolve , reject) => {
      this.afAuth.createUserWithEmailAndPassword(value.email, value.password)
      .then(
        res => resolve(res),
        err => reject(err))
    })
  }
  loginUser( value ) {
    return new Promise<any> (( resolve, reject )=>{
      this.afAuth.signInWithEmailAndPassword( value.email, value.password)
      .then( res => {
        this.isLogIn = true;
        this.userService.getUser( firebase.auth().currentUser.uid )
        this.storageUserInfo( res )
          resolve(res)
        },
        err => reject(err))
    })
  }
  loginOutUser(){
    return new Promise((resolve, reject)=>{
      if( this.afAuth.currentUser ){
        this.afAuth.signOut()
        .then(()=>{
          this.isLogIn = false
          console.log("Logout");
          resolve(true);
        }).catch(( error )=>{
          reject(error);
        });
      }
    })
  }
  userDetails(){
    return firebase.auth().currentUser
  }
  storageUserInfo( data ) {
    this.userObserver.subscribe(res=>{
      const userInfo = {
        userInfoFireBase: {
          providerData: data.user.providerData,
          token: data.user.refreshToken,
          photoURL: data.user.photoURL
        },
        userInfoDB: res
      }
      this.storage.set("userInfo", userInfo)
      console.log("userInfo ", userInfo)
    })
  }
}
