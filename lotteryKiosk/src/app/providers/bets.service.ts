import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'
import { Observable } from 'rxjs'
import { DataService } from './data-service.service';
import * as firabase from 'firebase'
@Injectable({
  providedIn: 'root'
})
export class BetsService {

  bet: Observable<any[]>

  constructor( private fb: AngularFirestore, private dataService: DataService ) { }

  setBetToDB( newBet ){
    let dataToSend = {
      combination1: newBet.combination1,
      extras: newBet.extranumber,
      idType: newBet.idType,
      codes: this.dataService.getData('codeGroup')
    }
    if ( newBet.ref ){
      return this.fb.collection('bets').doc( newBet.ref )
      .set( dataToSend, { merge: true } )
      .then( res => res )
      .catch( err => err )
    }else{
      dataToSend['date'] = new Date()
      return this.fb.collection('bets')
      .add( dataToSend )
      .then( res => res )
      .catch( err => err )
    }
  }
  removeBet( bet ) {
    return this.fb.collection('bets').doc( bet.referenciaDB ).delete()
    .then( res => res )
    .catch( error => error )
  }
  getBetFromDB(){
    return new Promise<any>((resolve, reject) =>{
      firabase.firestore().collection('bets')
      .where('codes', '==', this.dataService.getData('codeGroup'))
      .get()
      .then( snapShot =>{
        let bets = []
        snapShot.forEach( betLine => {
          bets.push({
            id: betLine.id,
            ...betLine.data()
          })
          console.log("betS ", bets)
        });
        resolve( bets )
      })

    })
  }
}
