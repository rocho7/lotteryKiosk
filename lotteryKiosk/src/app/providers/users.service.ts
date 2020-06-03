import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'
import { Observable } from 'rxjs'
import { error } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  users: Observable<any[]>
  roles: Observable<any[]>
  amount: Observable<any[]>
  constructor( private firestore: AngularFirestore ) {}

  registerAccountDB( user ){
    let data = {
      uid : user.uid,
      email : user.email,
      nick : user._nick,
      name : user.name,
      registerDate : new Date(),
      acceptedProtectonLaw: user.acceptedProtectonLaw,
      idrole: user.idrole
    }
    return this.firestore.collection('users').doc( user.uid ).set( data )
    .then( res =>{
      return true
    }).catch( error =>{
      return error
    })
  }
  getUsers(){
    let leadePosts = {}
    return this.users = this.firestore.collection('users').snapshotChanges();
  }
  getRoles(){
    return this.roles = this.firestore.collection('usersRole').snapshotChanges();
  }
  getBalance(){
    return this.amount = this.firestore.collection('balance').snapshotChanges();
  }
  addBalance( amount: object ){
    // return this.firestore.collection('balance').doc( idbalance ).set( amount )
    return this.firestore.collection('balance').add( amount )
    .then( res =>{
      return res
    })
    .catch( error =>{
      return error
    } )
  }
}
