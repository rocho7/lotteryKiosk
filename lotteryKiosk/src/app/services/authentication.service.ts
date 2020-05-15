import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isLogIn = false;
  constructor( private afAuth : AngularFireAuth ) { }

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
      .then(
        res => {
          this.isLogIn = true;
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
          console.log("Logout");
          resolve();
        }).catch(( error )=>{
          reject();
        });
      }
    })
  }
  userDetails(){
    return this.afAuth.user
  }
}
