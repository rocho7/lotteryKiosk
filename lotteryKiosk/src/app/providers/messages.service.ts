import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  messagesList: Observable<any[]>

  constructor( private fb: AngularFirestore ) { }

  getMessages(){
    return this.messagesList = this.fb.collection('messages').snapshotChanges()
  }
}
