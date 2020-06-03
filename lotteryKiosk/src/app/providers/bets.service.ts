import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class BetsService {

  bet: Observable<any[]>

  constructor( private fb: AngularFirestore ) { }

  setBetToDB( newBet ){
    let dataToSend = {
      combination1: newBet.combination1,
      extras: newBet.extranumber,
      idType: newBet.idType,
    }
    if ( newBet.ref ){
      return this.fb.collection('bets').doc( newBet.ref )
      .set( dataToSend, { merge: true } )
      .then( res => res )
      .catch( err => err )
    }else{
      dataToSend.date = new Date()
      return this.fb.collection('bets')
      .add( dataToSend )
      .then( res => res )
      .catch( err => err )
    }
  }
  removeBet( bet ) {
    return this.fb.collection('bets').doc( bet.ref ).delete()
    .then( res => res )
    .catch( error => error )
  }
  getBetFromDB(){
    return this.bet = this.fb.collection('bets').snapshotChanges()
  }
}
