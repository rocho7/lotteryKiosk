import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'
import { Observable } from 'rxjs'
import { UsersService } from './users.service';
import * as firebase from 'firebase'

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  codeList: Observable<any[]>

  constructor( private fb: AngularFirestore, private userSerive: UsersService) { }

  createGroup( value, code, uid ){
    let dataToSend = {
      name: value.name,
      description: value.description,
      date: new Date(),
      code,
      uid
    }
  
    return this.fb.collection('group').add( dataToSend )
    .then( res => {
      if ( res ) {
        this.setUserField( uid, code )
      }
    })
    .catch( err => err )
  }
  getAllCodes(){
    return this.codeList = this.fb.collection('group').snapshotChanges()
  }
  generateRandomCode(){
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  }
  setUserField( uid, code ){
    let fields = {
      idrole: 'ROLE_AD',
      codes: firebase.firestore.FieldValue.arrayUnion( code )
    }
    this.userSerive.setUser( uid,fields )
    .then( res => res )
    .catch( err => err )
  }
  getAllGroups(){
    return this.fb.collection('group').snapshotChanges()
  }
  removeGroup( uid ) {
    return this.fb.collection('group').doc( uid ).delete()
    .then( res => res )
    .catch( err => err )
  }
}
