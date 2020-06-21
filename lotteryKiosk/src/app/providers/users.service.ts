import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'
import { Observable, BehaviorSubject } from 'rxjs'
import * as firebase from 'firebase'
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  users = []
  user = []
  roles: Observable<any[]>
  amount: Observable<any[]>
  userWatcher = new BehaviorSubject<any>([])
  userWatcher$ = this.userWatcher.asObservable()
  codeGroup  = new BehaviorSubject<string>('')
  codeGroup$ = this.codeGroup.asObservable()

  constructor( private firestore: AngularFirestore ) {}

  registerAccountDB( user ){
    let data = {
      uid : user.uid,
      email : user.email,
      nick : user._nick,
      name : user.name,
      registerDate : new Date(),
      acceptedProtectionLaw: user.acceptedProtectionLaw,
      idrole: user.idrole,
      language: user.language,
      avatar: {
        ...user.avatar
      }
    }
    return this.firestore.collection('users').doc( user.uid ).set( data )
    .then( res =>{
      return true
    }).catch( error =>{
      return error
    })
  }
  getUsers( codeGroup ){

    return new Promise<any>(( resolve, reject ) =>{
      
       firebase.firestore().collection('users').where("codes", "array-contains", codeGroup)
       .get()
        .then( querySnapshot =>{
        this.users = []
        querySnapshot.forEach( user => {
          this.users.push ({
            id: user.id,
            data: user.data()
          })
        });
        console.log("this.users ", this.users)

        this.codeGroup.next( codeGroup )    
        
        resolve( this.users )
      })
      .catch( err => reject(err))
    }) 
  }
  getUser( uid ) {
    firebase.firestore().collection('users').doc( uid ).onSnapshot(doc =>{
      this.user = []
      this.user.push( doc.data())
      this.userWatcher.next( this.user )
    })    
  }
  setUser( uid, fieldsModified ){
    return this.firestore.collection('users').doc( uid ).set( fieldsModified , {merge: true})
    .then( res => res )
    .catch( err => err)
  }
  
  getRoles(){
    return this.roles = this.firestore.collection('usersRole').snapshotChanges();
  }
  getBalance( codeGroup ){
    return new Promise<any>(( resolve, reject )=>{
      firebase.firestore().collection('balance').where("codes", "==", codeGroup)
      .get()
      .then( res =>{
        let balance = []
        res.forEach( line => {
          balance.push({
            id: line.id,
            data: line.data()
          })
        });
        resolve( balance )
      })
    })
  }
  addBalance( amount: object ){
    return this.firestore.collection('balance').add( amount )
    .then( res =>{
      return res
    })
    .catch( error =>{
      return error
    } )
  }
}
