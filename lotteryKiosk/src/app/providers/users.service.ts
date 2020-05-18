import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  users: Observable<any[]>
  roles: Observable<any[]>

  constructor( private firestore: AngularFirestore ) {}

  getUsers(){
    let leadePosts = {}
    return this.users = this.firestore.collection('users').snapshotChanges();
    
    // posts.get()
    // .then((docSnaps) =>{

    // })
  }
  getRoles(){
    return this.roles = this.firestore.collection('usersRole').snapshotChanges();
  }
}
